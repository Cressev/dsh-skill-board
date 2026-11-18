/** Build both faces programmatically: host ESM bundles + client loader bundle. */
import { build } from 'tsdown'
import { CssPlugin } from '@tsdown/css'
import { transform } from 'esbuild'
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Pre-transform TS sources to decorator-free JS in a temp dir esbuild handles. */
async function preTransform(): Promise<string> {
  const out = 'node_modules/.prebuild'
  await mkdir(out, { recursive: true })
  async function walk(dir: string): Promise<void> {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const from = join(dir, entry.name)
      if (entry.isDirectory()) { await walk(from); continue }
      if (/\.css$/.test(entry.name)) {
        const rel = from.replace(/^src\//, '')
        await mkdir(join(out, rel, '..'), { recursive: true }).catch(() => {})
        await writeFile(join(out, rel), await readFile(from))
        continue
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) continue
      const code = await transform(await readFile(from, 'utf8'), {
        loader: entry.name.endsWith('.tsx') ? 'tsx' : 'ts',
        format: 'esm',
        target: 'es2024',
        // Keep TC39 decorators intact (the host runtime and the sandboxed
        // Node both support them natively); strip only types.
        tsconfigRaw: { compilerOptions: { experimentalDecorators: false } },
        jsx: 'automatic',
      })
      const rel = from.replace(/^src\//, '')
      await mkdir(join(out, rel, '..'), { recursive: true }).catch(() => {})
      // Rewrite relative specifiers to the emitted .mjs names.
      const rewritten = code.code
        .replace(/from (["'])(\.\.?\/[^"']*?)\.tsx?\1/g, 'from $1$2.mjs$1')
        .replace(/from (["'])(\.\.?\/[^"']*?)\.styles\1/g, 'from $1$2.styles.mjs$1')
      await writeFile(join(out, rel.replace(/\.tsx?$/, '.mjs')), rewritten)
    }
  }
  await walk('src')
  return out
}

const pre = await preTransform()
const only = process.env.SB_ONLY ?? ''

const nodeExternals = [/^@deepseek-ai\//, 'node:fs', 'node:fs/promises', 'node:path', 'node:crypto']
const browserExternals = ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'zod', 'clsx', /^@deepseek-ai\//]

// Host face: ESM bundles with peer externals.
if (only !== 'client') {
  await build({
    entry: { index: `${pre}/index.mjs`, remote: `${pre}/remote.mjs` },
    outDir: 'lib',
    format: 'esm',
    platform: 'node',
    target: 'es2024',
    dts: { resolve: false },
    clean: false,
    // 0.23 deprecated `externals`; neverBundle keeps npm packages out of the bundle.
    deps: { neverBundle: true },
  })
}

// Client face runs in a plain-node child: the tsx loader interferes with the
// CSS plugin's module hooks. Inputs are already plain .mjs from preTransform.
if (only !== 'client') {
  const { spawnSync } = await import('node:child_process')
  const r = spawnSync('node', ['build-client.mjs'], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('client build failed')
}

console.log('prebuilt from', pre)
console.log('build done: lib/index.mjs, lib/remote.mjs, lib/client.js')
