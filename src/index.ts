/**
 * Skill board: per-session skill catalog, usage statistics, and session-level
 * enable/disable through scope shadows.
 *
 * Three cooperating pieces:
 * - Catalog: `ctx.skills.snapshot({ scope: agent })` per selected session; a
 *   session with no live agent falls back to the global view.
 * - Session toggles: disabling a skill registers a runtime shadow (same name,
 *   `invocation` all-off) through `agent.ctx.skills.register()`, which lands
 *   in that agent's own scope layer — the nearest layer, so it shadows the
 *   preset/global entry. The pre-step catalog rebuild and the skill tool's
 *   execution checks both read the layered view, so the skill disappears from
 *   the model's `<available_skills>` and a direct call fails loudly. The
 *   disabled-set persists per session id and re-applies on agent creation.
 * - Usage: per-session numbers fold the session's own event log
 *   (`tool/call`/`tool/result` for the `skill` tool); global counters update
 *   live from `tools/result`.
 *
 * @module skill-board-plugin
 */

import { rm } from 'node:fs/promises'
import { getTraceable, type Context } from '@deepseek-ai/cordis'
import { resolveAgentsHome, resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import * as skillFilesystem from '@deepseek-ai/dsh-skill-filesystem'
import type {} from '@deepseek-ai/dsh-skill'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { defineDomain, domainTable, type Domain } from '@deepseek-ai/dsh-storage-domain'
import type {} from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import z from '@deepseek-ai/schemastery'
import { z as zod } from 'zod'
import type { SkillBoardCatalog, SkillBoardDetail, SkillBoardRow, SkillBoardSession } from './remote.ts'

/** One invocation counter row (storage-domain). */
interface SkillStatRecord {
  readonly name: string
  readonly totalCalls: number
  readonly errorCalls: number
  readonly lastCalledAt: number
  readonly lastSessionId: string
}

/** One session's persisted override set over the global defaults. */
interface OverrideRecord {
  readonly sessionId: string
  /** Skills this session disables even when globally enabled. */
  readonly disabled?: readonly string[] | undefined
  /** Skills this session enables even when globally disabled. */
  readonly enabled?: readonly string[] | undefined
}

const statSchema = zod.object({
  name: zod.string(),
  totalCalls: zod.number(),
  errorCalls: zod.number(),
  lastCalledAt: zod.number(),
  lastSessionId: zod.string(),
})

const overrideSchema = zod.object({
  sessionId: zod.string(),
  disabled: zod.array(zod.string()).optional(),
  enabled: zod.array(zod.string()).optional(),
})

/** Storage-domain spec: global counters plus per-session disabled sets. */
const skillBoardDomain = defineDomain({
  name: 'skill_board',
  version: 2,
  compatibleVersions: [1],
  // v1 per-session `names` records fail the new schema and are backed up and
  // skipped: those sets were transient toggles, not authoritative data.
  invalidRecords: 'backup-and-skip',
  global: {
    // `default([])` back-fills the v1 stored global, which lacks the field.
    schema: zod.object({ trackedSince: zod.number(), disabled: zod.array(zod.string()).default([]) }),
    initial: { trackedSince: 0, disabled: [] },
  },
  tables: {
    stats: domainTable<string, SkillStatRecord>(statSchema),
    disabled: domainTable<string, OverrideRecord>(overrideSchema),
  },
})

/** One folded skill invocation aggregate for a session. */
interface SessionFold {
  readonly calls: Map<string, { total: number, errors: number, lastAt: number }>
}

/** Host service: session-aware skill board. */
export class SkillBoardService extends TypertRemoteService {
  static inject = ['skills', 'agents', 'sessions', 'storageDomain']

  static Config = z.object({})

  private readonly domain: Promise<Domain<typeof skillBoardDomain>>
  /** Live shadow disposers per (sessionId, skillName). */
  private readonly shadows = new Map<string, () => void>()

  /**
   * @param ctx - Host context carrying skill, agent, session, query, and storage services.
   * @param config - Empty validated configuration.
   */
  constructor(ctx: Context, config: InstanceType<typeof SkillBoardService.Config>) {
    super(ctx, 'skillBoard')
    void config
    // The web composition disables the host-level skill-filesystem row (each
    // preset owns discovery in its scope), so the global layer would be empty
    // while no agent is live. Mount one isolated provider as the baseline.
    ctx.plugin(skillFilesystem, {
      providerName: 'skill-board',
      includeDefaultRoots: true,
      dshHome: resolveDshHome(),
      agentsHome: resolveAgentsHome(),
      bundledSkillDir: process.env.DSH_BUNDLED_SKILL_DIR ?? '/__skill_board_no_bundled__',
    })
    this.domain = ctx.storageDomain.open(skillBoardDomain)
    ctx.effect(() => () => { void this.domain.then(domain => domain.close()) }, 'skillBoard: storage')
    void this.start()
    ctx.on('tools/result', (exec, result) => {
      const agent = exec.agent
      if (agent === undefined || exec.name !== 'skill') return
      const parsed = zod.object({ name: zod.string() }).safeParse(exec.arguments)
      if (!parsed.success) return
      void this.record(parsed.data.name, result.isError === true, agent.id)
    }, { global: true })
    // Cold sessions with stored disabled-sets receive their shadows on create.
    ctx.on('agent/created', ({ agent }) => { void this.applyStoredShadows(agent.id) })
  }

  /** Seed the tracking epoch once. */
  private async start(): Promise<void> {
    const domain = await this.domain
    if (domain.global.get().trackedSince === 0) {
      await domain.global.set({ trackedSince: Date.now(), disabled: [] })
    }
  }

  /**
   * Build the board for one session (or the global view).
   * @param request - target session id; omitted selects the global view.
   * @returns rows, session list, and metadata.
   */
  @Remote('catalog')
  async catalog(request: { sessionId?: string }): Promise<SkillBoardCatalog> {
    const sessionId = request.sessionId ?? ''
    const sessions = await this.sessionList()
    const live = sessionId === '' ? undefined : this.ctx.agents.get(sessionId as SessionId)
    let sessionTitle = ''
    let fold: SessionFold = { calls: new Map() }
    const globalDisabled = new Set(await this.globalDisabledOf())
    let overrides: OverrideRecord = { sessionId }
    if (sessionId !== '' && live !== undefined) {
      sessionTitle = titleOf(live.session.snapshotEvents())
      fold = foldSessionSkills(live.session.snapshotEvents())
      overrides = await this.overridesOf(sessionId)
    }
    const rows = await this.catalogRows(live, globalDisabled, overrides, fold)
    return {
      sessionId,
      sessionTitle,
      sessionLive: live !== undefined,
      rows,
      sessions,
      trackedSince: (await this.domain).global.get().trackedSince,
    }
  }

  /**
   * Live sessions for the selector.
   * @returns every live agent with its folded title.
   */
  @Remote('sessions')
  async sessions(): Promise<{ sessions: readonly SkillBoardSession[] }> {
    return { sessions: await this.sessionList() }
  }

  /**
   * Toggle one skill for one session: persist the disabled-set and apply or
   * remove the scope shadow on the live agent.
   * @param request - session id, skill name, next state.
   * @returns the refreshed catalog for that session.
   */
  @Remote('setDisabled')
  async setDisabled(request: { sessionId: string, name: string, disabled: boolean }): Promise<SkillBoardCatalog> {
    const domain = await this.domain
    const table = domain.table('disabled')
    const record = table.get(request.sessionId) ?? { sessionId: request.sessionId }
    const disabledSet = new Set(record.disabled ?? [])
    const enabledSet = new Set(record.enabled ?? [])
    disabledSet.delete(request.name)
    enabledSet.delete(request.name)
    // Normalize: an override equal to the global default is no override.
    const globalDefault = (await this.globalDisabledOf()).includes(request.name)
    if (request.disabled !== globalDefault) {
      if (request.disabled) disabledSet.add(request.name)
      else enabledSet.add(request.name)
    }
    if (disabledSet.size === 0 && enabledSet.size === 0) await table.delete(request.sessionId)
    else await table.put(request.sessionId, {
      sessionId: request.sessionId,
      disabled: [...disabledSet].sort(),
      enabled: [...enabledSet].sort(),
    })
    await this.syncShadows(request.sessionId)
    return this.catalog({ sessionId: request.sessionId })
  }

  /**
   * Toggle one skill's global default: every session without an explicit
   * override follows it, and all live agents re-sync their shadows.
   * @param request - skill name and the next global disabled state.
   * @returns the global catalog after the change.
   */
  @Remote('setGlobalDisabled')
  async setGlobalDisabled(request: { name: string, disabled: boolean }): Promise<SkillBoardCatalog> {
    const domain = await this.domain
    const current = domain.global.get()
    const names = new Set(current.disabled ?? [])
    if (request.disabled) names.add(request.name)
    else names.delete(request.name)
    await domain.global.set({ ...current, disabled: [...names].sort() })
    for (const agent of this.ctx.agents.list()) await this.syncShadows(agent.id)
    return this.catalog({})
  }

  /**
   * Read one skill's complete detail for the board's detail dialog.
   * @param request - skill name and the session whose usage is reported.
   * @returns routing metadata, source path, invocation policy, usage and body.
   */
  @Remote('detail')
  async detail(request: { name: string, sessionId?: string }): Promise<SkillBoardDetail> {
    const sessionId = request.sessionId ?? ''
    const lived = sessionId === '' ? undefined : this.ctx.agents.get(sessionId as SessionId)
    const options = lived !== undefined
      ? { scope: lived, cwd: lived.session.header.cwd }
      : { cwd: process.cwd() }
    const summary = (await this.ctx.skills.list(options)).find(skill => skill.name === request.name)
    if (summary === undefined) {
      throw new Error(`skillBoard: skill "${request.name}" is not mounted in this view`)
    }
    const definition = await this.ctx.skills.get(request.name, options)
    const globalDisabled = new Set(await this.globalDisabledOf())
    const overrides = sessionId === '' ? { sessionId } : await this.overridesOf(sessionId)
    const fold = lived === undefined ? { calls: new Map() } : foldSessionSkills(lived.session.snapshotEvents())
    const folded = fold.calls.get(request.name)
    const stat = (await this.domain).table('stats').get(request.name)
    const override: 'none' | 'enabled' | 'disabled'
      = (overrides.enabled ?? []).includes(request.name) ? 'enabled'
        : (overrides.disabled ?? []).includes(request.name) ? 'disabled'
          : 'none'
    return {
      name: summary.name,
      description: summary.description,
      whenToUse: summary.whenToUse ?? '',
      source: summary.source,
      provider: summary.provider,
      path: summary.path ?? '',
      modelInvocable: summary.invocation.modelInvocable,
      userInvocable: summary.invocation.userInvocable,
      disabled: sessionId === '' ? globalDisabled.has(request.name) : this.effectiveDisabled(request.name, globalDisabled, overrides),
      sessionOverride: sessionId === '' ? 'none' : override,
      globalDisabled: globalDisabled.has(request.name),
      sessionCalls: folded?.total ?? 0,
      sessionErrors: folded?.errors ?? 0,
      sessionLastCalledAt: folded?.lastAt ?? 0,
      totalCalls: stat?.totalCalls ?? 0,
      lastCalledAt: stat?.lastCalledAt ?? 0,
      content: definition?.content ?? '',
    }
  }

  /**
   * Clear global invocation counters and restart the tracking epoch.
   * @returns the global catalog after the reset.
   */
  @Remote('reset')
  async reset(): Promise<SkillBoardCatalog> {
    const domain = await this.domain
    await domain.table('stats').deleteMany([...domain.table('stats').keys()])
    // Reset clears counters only; the global disabled defaults survive.
    await domain.global.set({ ...domain.global.get(), trackedSince: Date.now() })
    return this.catalog({})
  }

  /** Read the persisted global default disabled set. */
  private async globalDisabledOf(): Promise<readonly string[]> {
    const domain = await this.domain
    return domain.global.get().disabled ?? []
  }

  /** Read one session's persisted overrides over the global defaults. */
  private async overridesOf(sessionId: string): Promise<OverrideRecord> {
    const domain = await this.domain
    return domain.table('disabled').get(sessionId) ?? { sessionId }
  }

  /** Effective disabled state: a session's explicit override wins over the global default. */
  private effectiveDisabled(name: string, globalDisabled: ReadonlySet<string>, overrides: OverrideRecord): boolean {
    if ((overrides.enabled ?? []).includes(name)) return false
    if ((overrides.disabled ?? []).includes(name)) return true
    return globalDisabled.has(name)
  }

  /** Build the merged catalog rows for the viewing agent (or globally). */
  private async catalogRows(live: ReturnType<typeof this.ctx.agents.get> | undefined, globalDisabled: ReadonlySet<string>, overrides: OverrideRecord, fold: SessionFold): Promise<SkillBoardRow[]> {
    const agents = this.ctx.agents.list()
    const viewAgent = live ?? (agents.length > 0 ? undefined : undefined)
    const options = live !== undefined
      ? { scope: live, cwd: live.session.header.cwd }
      : agents.length > 0
        ? { scope: agents[0], cwd: agents[0].session.header.cwd }
        : { cwd: process.cwd() }
    void viewAgent
    let snapshot: Awaited<ReturnType<typeof this.ctx.skills.snapshot>>
    try {
      snapshot = await this.ctx.skills.snapshot(options)
    } catch {
      snapshot = { skills: [], complete: true }
    }
    const domain = await this.domain
    const stats = domain.table('stats')
    const rows: SkillBoardRow[] = snapshot.skills.map(skill => {
      const stat = stats.get(skill.name)
      const folded = fold.calls.get(skill.name)
      const isGlobal = overrides.sessionId === ''
      const globallyDisabled = globalDisabled.has(skill.name)
      const override: 'none' | 'enabled' | 'disabled'
        = (overrides.enabled ?? []).includes(skill.name) ? 'enabled'
          : (overrides.disabled ?? []).includes(skill.name) ? 'disabled'
            : 'none'
      return {
        name: skill.name,
        description: skill.description,
        sources: [skill.source],
        modelInvocable: skill.invocation.modelInvocable,
        userInvocable: skill.invocation.userInvocable,
        // Global view reports the default; a session view reports the effective state.
        disabled: isGlobal ? globallyDisabled : this.effectiveDisabled(skill.name, globalDisabled, overrides),
        globalDisabled: globallyDisabled,
        sessionOverride: isGlobal ? 'none' : override,
        sessionCalls: folded?.total ?? 0,
        sessionErrors: folded?.errors ?? 0,
        sessionLastCalledAt: folded?.lastAt ?? 0,
        totalCalls: stat?.totalCalls ?? 0,
        lastCalledAt: stat?.lastCalledAt ?? 0,
      }
    })
    rows.sort((a, b) => b.sessionCalls - a.sessionCalls || b.totalCalls - a.totalCalls || a.name.localeCompare(b.name))
    return rows
  }

  /** Live sessions plus the implicit global view, newest activity last. */
  private async sessionList(): Promise<SkillBoardSession[]> {
    const out: SkillBoardSession[] = []
    for (const agent of this.ctx.agents.list()) {
      out.push({
        sessionId: agent.id,
        title: titleOf(agent.session.snapshotEvents()),
        live: true,
        cwd: agent.session.header.cwd ?? '',
      })
    }
    return out
  }

  /** Apply or remove shadows so the live agent matches its effective set. */
  private async syncShadows(sessionId: string): Promise<void> {
    const agent = this.ctx.agents.get(sessionId as SessionId)
    if (agent === undefined) return
    const globalDisabled = new Set(await this.globalDisabledOf())
    const overrides = await this.overridesOf(sessionId)
    const names = [...(overrides.enabled ?? []), ...(overrides.disabled ?? []), ...globalDisabled]
      .filter(name => this.effectiveDisabled(name, globalDisabled, overrides))
    for (const key of [...this.shadows.keys()]) {
      if (!key.startsWith(`${sessionId}\0`)) continue
      const name = key.slice(sessionId.length + 1)
      if (!names.includes(name)) {
        this.shadows.get(key)?.()
        this.shadows.delete(key)
      }
    }
    for (const name of names) {
      const key = `${sessionId}\0${name}`
      if (this.shadows.has(key)) continue
      const summary = (await this.ctx.skills.list({ scope: agent, cwd: agent.session.header.cwd })).find(skill => skill.name === name)
      if (summary === undefined) continue
      // The agent's fiber tree cannot see this plugin's `skills` provision, so
      // reach through the registry service directly and rebind it to the
      // agent's scoped context: getTraceable makes the subsequent register()
      // read `this.ctx` as the agent ctx, whose scope tag lands the shadow in
      // that agent's own layer (the nearest layer wins the name).
      const agentSkills = getTraceable(agent.ctx, this.ctx.skills)
      this.shadows.set(key, agentSkills.register({
        name,
        description: summary.description,
        source: 'runtime',
        content: `Skill "${name}" is disabled for this session by the skill board.`,
        invocation: { modelInvocable: false, userInvocable: false },
      }))
    }
  }

  /** Apply stored shadows after a cold session's agent comes alive. */
  private async applyStoredShadows(sessionId: SessionId): Promise<void> {
    await this.syncShadows(sessionId)
  }

  /** Apply one observed skill invocation to the global counter table. */
  private async record(name: string, isError: boolean, sessionId: SessionId): Promise<void> {
    const domain = await this.domain
    const table = domain.table('stats')
    const current = table.get(name)
    await table.put(name, {
      name,
      totalCalls: (current?.totalCalls ?? 0) + 1,
      errorCalls: (current?.errorCalls ?? 0) + (isError ? 1 : 0),
      lastCalledAt: Date.now(),
      lastSessionId: sessionId,
    })
  }
}

/** Read the latest durable title from a session's events. */
function titleOf(events: readonly { type: string, data: unknown }[]): string {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]
    if (event.type !== 'session/title') continue
    const data = event.data as { title?: unknown }
    if (typeof data.title === 'string' && data.title.length > 0) return data.title
  }
  return ''
}

/** Fold per-skill invocation counts from one session's event log. */
function foldSessionSkills(events: readonly { type: string, data: unknown }[]): SessionFold {
  const calls = new Map<string, { total: number, errors: number, lastAt: number }>()
  const callSkill = new Map<string, string>()
  for (const event of events) {
    if (event.type === 'tool/call') {
      const data = event.data as { name?: unknown, callId?: unknown, arguments?: unknown }
      if (data.name !== 'skill' || typeof data.callId !== 'string') continue
      let skillName: string | undefined
      if (typeof data.arguments === 'string') {
        try {
          const parsed: unknown = JSON.parse(data.arguments)
          skillName = typeof (parsed as { name?: unknown }).name === 'string' ? (parsed as { name: string }).name : undefined
        } catch {
          skillName = undefined
        }
      }
      if (skillName === undefined) continue
      callSkill.set(data.callId, skillName)
      const row = calls.get(skillName) ?? { total: 0, errors: 0, lastAt: 0 }
      row.total += 1
      calls.set(skillName, row)
    } else if (event.type === 'tool/result') {
      const data = event.data as { message?: { toolCallId?: unknown, isError?: unknown } }
      const callId = data.message?.toolCallId
      const skillName = typeof callId === 'string' ? callSkill.get(callId) : undefined
      if (skillName === undefined || data.message?.isError !== true) continue
      const row = calls.get(skillName)
      if (row === undefined) continue
      row.errors += 1
    }
  }
  return { calls }
}

export default SkillBoardService
