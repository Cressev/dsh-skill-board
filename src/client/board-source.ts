/**
 * Observable board snapshot: loads through the mounted remote namespace and
 * keeps one reference-stable snapshot per state change. The selected session
 * rides inside each load request, so switching sessions reloads through the
 * same source.
 */

import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots'
import type { SkillBoardCatalog, SkillBoardDetail, SkillBoardRow, SkillBoardSession } from '../remote.ts'

/** Board read state. */
export type BoardStatus = 'loading' | 'ready' | 'error'

/** One snapshot of the whole board, reference-stable between changes. */
export interface BoardSnapshot {
  readonly status: BoardStatus
  readonly sessionId: string
  readonly rows: readonly SkillBoardRow[]
  readonly sessionTitle: string
  readonly sessionLive: boolean
  readonly sessions: readonly SkillBoardSession[]
  readonly trackedSince: number
  /** Whether a previous successful read still populates the view during an error or refresh. */
  readonly populated: boolean
}

/** Remote namespace face consumed by the source. */
export interface SkillBoardApi {
  catalog(request: { sessionId?: string }): Promise<{ ok: boolean, value?: SkillBoardCatalog, error?: unknown }>
  setDisabled(request: { sessionId: string, name: string, disabled: boolean }): Promise<{ ok: boolean, value?: SkillBoardCatalog, error?: unknown }>
  setGlobalDisabled(request: { name: string, disabled: boolean }): Promise<{ ok: boolean, value?: SkillBoardCatalog, error?: unknown }>
  detail(request: { name: string, sessionId?: string }): Promise<{ ok: boolean, value?: SkillBoardDetail, error?: unknown }>
  reset(): Promise<{ ok: boolean, value?: SkillBoardCatalog, error?: unknown }>
}

const EMPTY: BoardSnapshot = { status: 'loading', sessionId: '', rows: [], sessionTitle: '', sessionLive: false, sessions: [], trackedSince: 0, populated: false }

/**
 * Own the board snapshot lifetime for one page registration.
 */
export class BoardSource implements HostObservable<BoardSnapshot> {
  private snapshot: BoardSnapshot = EMPTY
  private readonly listeners = new Set<() => void>()
  private loadStarted = false

  /**
   * @param api - mounted `remote.skillBoard` namespace.
   */
  constructor(private readonly api: SkillBoardApi) {}

  getSnapshot(): BoardSnapshot { return this.snapshot }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    if (this.listeners.size === 1 && !this.loadStarted) this.load()
    return () => { this.listeners.delete(listener) }
  }

  /** Read the catalog for a session again; failures keep the previous rows. */
  load(sessionId = this.snapshot.sessionId): void {
    this.loadStarted = true
    this.set({ ...this.snapshot, sessionId, status: this.snapshot.populated ? 'ready' : 'loading' })
    void this.read(this.api.catalog(sessionId === '' ? {} : { sessionId }))
  }

  /** Toggle one skill for the selected session and adopt the returned catalog. */
  setDisabled(name: string, disabled: boolean): void {
    const sessionId = this.snapshot.sessionId
    if (sessionId === '') return
    void this.read(this.api.setDisabled({ sessionId, name, disabled }))
  }

  /** Toggle one skill's global default from the global view. */
  setGlobalDisabled(name: string, disabled: boolean): void {
    void this.read(this.api.setGlobalDisabled({ name, disabled }))
  }

  /**
   * Read one skill's detail for the dialog.
   * @param name - skill name.
   * @returns the detail, or undefined when the read failed.
   */
  async detail(name: string): Promise<SkillBoardDetail | undefined> {
    const sessionId = this.snapshot.sessionId
    const result = await this.api.detail(sessionId === '' ? { name } : { name, sessionId })
    return result.ok ? result.value : undefined
  }

  /** Clear counters on the host and adopt the returned fresh catalog. */
  reset(): void {
    void this.read(this.api.reset())
  }

  private async read(pending: Promise<{ ok: boolean, value?: SkillBoardCatalog, error?: unknown }>): Promise<void> {
    try {
      const result = await pending
      if (!result.ok || result.value === undefined) throw new Error(String(result.error))
      const value = result.value
      this.set({
        status: 'ready',
        sessionId: value.sessionId,
        sessionTitle: value.sessionTitle,
        sessionLive: value.sessionLive,
        rows: value.rows,
        sessions: value.sessions,
        trackedSince: value.trackedSince,
        populated: true,
      })
    } catch {
      this.set({ ...this.snapshot, status: 'error' })
    }
  }

  private set(next: BoardSnapshot): void {
    if (next === this.snapshot) return
    this.snapshot = next
    for (const listener of this.listeners) listener()
  }
}
