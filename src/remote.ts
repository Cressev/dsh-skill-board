/** Host+client shared remote declaration for the `skillBoard` namespace. */
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol'
import { createTypertRemoteInfo } from '@deepseek-ai/dsh-typert-protocol/remote-info'
import { z } from 'zod'

/** One pickable session in the board's session selector. */
export interface SkillBoardSession {
  readonly sessionId: string
  readonly title: string
  readonly live: boolean
  readonly cwd: string
}

/** One aggregated skill row: catalog facts, per-session usage, session toggle. */
export interface SkillBoardRow {
  readonly name: string
  readonly description: string
  readonly sources: readonly string[]
  readonly modelInvocable: boolean
  readonly userInvocable: boolean
  /** Effective disabled state for the view (global view: the global default). */
  readonly disabled: boolean
  /** The global default for this skill. */
  readonly globalDisabled: boolean
  /** This session's explicit override, 'none' in the global view. */
  readonly sessionOverride: 'none' | 'enabled' | 'disabled'
  /** Calls in the selected session, folded from its own event log. */
  readonly sessionCalls: number
  readonly sessionErrors: number
  readonly sessionLastCalledAt: number
  /** Calls across all sessions since tracking began. */
  readonly totalCalls: number
  readonly lastCalledAt: number
}

/** Whole board snapshot for one selected session (or the global view). */
export interface SkillBoardCatalog {
  readonly sessionId: string
  readonly sessionTitle: string
  readonly sessionLive: boolean
  readonly rows: readonly SkillBoardRow[]
  readonly sessions: readonly SkillBoardSession[]
  readonly trackedSince: number
}

declare module '@deepseek-ai/dsh-typert-protocol' {
  interface TypertRemoteNamespaceMap {
    /** Skill-board catalog, session usage, and per-session toggles. */
    skillBoard: {
      catalog(request: { sessionId?: string }): Promise<RemoteResult<SkillBoardCatalog>>
      sessions(): Promise<RemoteResult<{ sessions: readonly SkillBoardSession[] }>>
      setDisabled(sessionId: string, name: string, disabled: boolean): Promise<RemoteResult<SkillBoardCatalog>>
      setGlobalDisabled(name: string, disabled: boolean): Promise<RemoteResult<SkillBoardCatalog>>
      reset(): Promise<RemoteResult<SkillBoardCatalog>>
    }
  }
}

const sessionSchema = z.object({
  sessionId: z.string(),
  title: z.string(),
  live: z.boolean(),
  cwd: z.string(),
})

const rowSchema = z.object({
  name: z.string(),
  description: z.string(),
  sources: z.array(z.string()),
  modelInvocable: z.boolean(),
  userInvocable: z.boolean(),
  disabled: z.boolean(),
  globalDisabled: z.boolean(),
  sessionOverride: z.enum(['none', 'enabled', 'disabled']),
  sessionCalls: z.number(),
  sessionErrors: z.number(),
  sessionLastCalledAt: z.number(),
  totalCalls: z.number(),
  lastCalledAt: z.number(),
})

const catalogSchema = z.object({
  sessionId: z.string(),
  sessionTitle: z.string(),
  sessionLive: z.boolean(),
  rows: z.array(rowSchema),
  sessions: z.array(sessionSchema),
  trackedSince: z.number(),
})

const sessionJson = { type: 'object', properties: { sessionId: { type: 'string' }, title: { type: 'string' }, live: { type: 'boolean' }, cwd: { type: 'string' } }, required: ['sessionId', 'title', 'live', 'cwd'], additionalProperties: true } as const
const rowJson = { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } }, modelInvocable: { type: 'boolean' }, userInvocable: { type: 'boolean' }, disabled: { type: 'boolean' }, globalDisabled: { type: 'boolean' }, sessionOverride: { type: 'string', enum: ['none', 'enabled', 'disabled'] }, sessionCalls: { type: 'number' }, sessionErrors: { type: 'number' }, sessionLastCalledAt: { type: 'number' }, totalCalls: { type: 'number' }, lastCalledAt: { type: 'number' } }, required: ['name', 'description', 'sources', 'modelInvocable', 'userInvocable', 'disabled', 'globalDisabled', 'sessionOverride', 'sessionCalls', 'sessionErrors', 'sessionLastCalledAt', 'totalCalls', 'lastCalledAt'], additionalProperties: true } as const
const catalogJson = { type: 'object', properties: { sessionId: { type: 'string' }, sessionTitle: { type: 'string' }, sessionLive: { type: 'boolean' }, rows: { type: 'array', items: rowJson }, sessions: { type: 'array', items: sessionJson }, trackedSince: { type: 'number' } }, required: ['sessionId', 'sessionTitle', 'sessionLive', 'rows', 'sessions', 'trackedSince'], additionalProperties: true } as const

const toggleRequestParam = {
  name: 'request',
  description: 'Session id, skill name, and the next disabled state.',
  source: 'json' as const,
  codec: { mode: 'strict' as const, typeSymbol: 'skill-board-plugin/remote#ToggleRequest', create: () => z.object({ sessionId: z.string(), name: z.string(), disabled: z.boolean() }), jsonSchema: { type: 'object', properties: { sessionId: { type: 'string' }, name: { type: 'string' }, disabled: { type: 'boolean' } }, required: ['sessionId', 'name', 'disabled'], additionalProperties: false } as const },
  strictCodec: { mode: 'strict' as const, typeSymbol: 'skill-board-plugin/remote#ToggleRequest', create: () => z.object({ sessionId: z.string(), name: z.string(), disabled: z.boolean() }), jsonSchema: { type: 'object', properties: { sessionId: { type: 'string' }, name: { type: 'string' }, disabled: { type: 'boolean' } }, required: ['sessionId', 'name', 'disabled'], additionalProperties: false } as const },
}

/** Hand-written remote contribution mirroring the generated clients' shape. */
export const skillBoardRemote = createTypertRemoteInfo({
  package: 'skill-board-plugin',
  methods: {
    'skillBoard/catalog': {
      service: 'skillBoard',
      description: 'List the selected session\'s skills with usage statistics and toggle state.',
      invocation: { kind: 'direct' },
      parameters: [{
        name: 'request',
        description: 'Target session id; omitted selects the global view.',
        source: 'json',
        codec: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#CatalogRequest', create: () => z.object({ sessionId: z.string().optional() }), jsonSchema: { type: 'object', properties: { sessionId: { type: 'string' } }, additionalProperties: false } as const },
        strictCodec: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#CatalogRequest', create: () => z.object({ sessionId: z.string().optional() }), jsonSchema: { type: 'object', properties: { sessionId: { type: 'string' } }, additionalProperties: false } as const },
      }],
      result: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#SkillBoardCatalog', create: () => catalogSchema, description: 'Rows, session list, and tracking metadata.', jsonSchema: catalogJson },
    },
    'skillBoard/sessions': {
      service: 'skillBoard',
      description: 'List live and recent sessions for the board selector.',
      invocation: { kind: 'direct' },
      parameters: [],
      result: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#SessionList', create: () => z.object({ sessions: z.array(sessionSchema) }), description: 'Sessions, live first.', jsonSchema: { type: 'object', properties: { sessions: { type: 'array', items: sessionJson } }, required: ['sessions'], additionalProperties: true } as const },
    },
    'skillBoard/setDisabled': {
      service: 'skillBoard',
      description: 'Enable or disable one skill for one session through a scope shadow.',
      invocation: { kind: 'direct' },
      parameters: [toggleRequestParam],
      result: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#SkillBoardCatalog', create: () => catalogSchema, description: 'The refreshed catalog for that session.', jsonSchema: catalogJson },
    },
    'skillBoard/setGlobalDisabled': {
      service: 'skillBoard',
      description: 'Toggle one skill global default; sessions without an override follow it.',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'request',
          description: 'Skill name and the next global disabled state.',
          source: 'json',
          codec: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#GlobalToggleRequest', create: () => z.object({ name: z.string(), disabled: z.boolean() }), jsonSchema: { type: 'object', properties: { name: { type: 'string' }, disabled: { type: 'boolean' } }, required: ['name', 'disabled'], additionalProperties: false } as const },
          strictCodec: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#GlobalToggleRequest', create: () => z.object({ name: z.string(), disabled: z.boolean() }), jsonSchema: { type: 'object', properties: { name: { type: 'string' }, disabled: { type: 'boolean' } }, required: ['name', 'disabled'], additionalProperties: false } as const },
        },
      ],
      result: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#SkillBoardCatalog', create: () => catalogSchema, description: 'The global catalog after the change.', jsonSchema: catalogJson },
    },
    'skillBoard/reset': {
      service: 'skillBoard',
      description: 'Clear global invocation counters and restart the tracking epoch.',
      invocation: { kind: 'direct' },
      parameters: [],
      result: { mode: 'strict', typeSymbol: 'skill-board-plugin/remote#SkillBoardCatalog', create: () => catalogSchema, description: 'The global catalog after the reset.', jsonSchema: catalogJson },
    },
  },
}, z)
