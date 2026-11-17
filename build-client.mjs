/** Client face build in a plain node process (tsx loader breaks CSS plugin hooks). */
import { build } from 'tsdown'
import { readFile, writeFile, rm } from 'node:fs/promises'

await build({
  entry: { client: 'node_modules/.prebuild/client/index.mjs' },
  outDir: 'lib',
  clean: false,
  format: 'cjs',
  externals: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client', 'zod', 'clsx', /^@deepseek-ai\//],
})

let code = await readFile('lib/client.cjs', 'utf8')
await rm('lib/client.cjs', { force: true })
await rm('lib/client.d.cts', { force: true })
const prologue = '\tvar module = { exports: {} };\n\tvar exports = module.exports;\n'
const epilogue = '\treturn module.exports;\n'
await writeFile('lib/client.js', `window.__ModuleLoader__.load({\n\tid: "dsh-skill-board",\n\tfactory: (require) => {\n${prologue}${code}${epilogue}\t},\n})\n`)
console.log('client bundle written')
