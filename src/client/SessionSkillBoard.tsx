/**
 * The per-session Skill view: charts plus manage switches for exactly the
 * open session. Registered beside the trajectory view tab.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Switch, Tag, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
// Brings the session standard props (sessionId and friends) into the program.
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import { StatCard, TopSkillsBars, UsageDonut } from './charts.tsx'
import { SkillDetailDialog } from './SkillDetail.tsx'
import type { SkillBoardDetail } from '../remote.ts'
import type { BoardSource, BoardSnapshot } from './board-source.ts'
import type { SkillBoardRow } from '../remote.ts'
import type { SkillBoardKey } from './locales.ts'
import { css } from './SessionSkillBoard.styles'

/** Injected face: per-session board source actions. */
export interface SessionBoardInjected {
  readonly toggle: (name: string, disabled: boolean) => void
  readonly reload: () => void
  readonly readDetail: (name: string) => Promise<SkillBoardDetail | undefined>
}

/** Full props of the session skill view. */
export type SessionSkillBoardProps =
  PropsRuntime<'conversation.view'>
  & PropsLocale<'skillBoard'>
  & InjectFace<SessionBoardInjected & { readonly hooks: { readonly board: BoardSource } }>

/**
 * The per-session skills view.
 * @param props - session standard props plus the per-session board source.
 * @returns the assembled view.
 */
export function SessionSkillBoard(props: SessionSkillBoardProps): ReactNode {
  const { t, useBoard, toggle, reload, readDetail } = props
  const sessionId = props.sessionId
  const board = useBoard((snapshot: BoardSnapshot) => snapshot)
  const live = board.sessionLive
  const viewRef = useRef<HTMLDivElement>(null)
  const [detail, setDetail] = useState<SkillBoardDetail | undefined>(undefined)
  const [detailName, setDetailName] = useState<string | undefined>(undefined)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailFailed, setDetailFailed] = useState(false)

  const openDetail = (name: string): void => {
    setDetailName(name)
    setDetail(undefined)
    setDetailFailed(false)
    setDetailLoading(true)
    void readDetail(name).then(value => {
      setDetail(value)
      setDetailFailed(value === undefined)
      setDetailLoading(false)
    })
  }
  const closeDetail = (): void => {
    setDetailName(undefined)
    setDetail(undefined)
    setDetailFailed(false)
    setDetailLoading(false)
  }

  // A conversation's scroll body rests at the bottom (newest message); this
  // view inherits that position when it mounts. Reset our own scroller and
  // the nearest scrolling ancestor so the board opens at its headline stats.
  useEffect(() => {
    const el = viewRef.current
    if (el !== null) {
      el.scrollTo({ top: 0 })
      let ancestor: HTMLElement | null = el.parentElement
      for (let depth = 0; depth < 6 && ancestor !== null; depth += 1) {
        const style = window.getComputedStyle(ancestor)
        const scrolls = /(auto|scroll)/.test(style.overflowY)
          && ancestor.scrollHeight > ancestor.clientHeight
        if (scrolls) {
          ancestor.scrollTo({ top: 0 })
          break
        }
        ancestor = ancestor.parentElement
      }
    }
  }, [sessionId])

  const invoked = useMemo(
    () => board.rows.reduce((sum, row) => sum + (row.sessionCalls > 0 ? 1 : 0), 0),
    [board.rows],
  )
  const disabledCount = useMemo(
    () => board.rows.reduce((sum, row) => sum + (row.disabled ? 1 : 0), 0),
    [board.rows],
  )
  const totalCalls = useMemo(
    () => board.rows.reduce((sum, row) => sum + row.sessionCalls, 0),
    [board.rows],
  )
  const topRows = useMemo(
    () => [...board.rows]
      .sort((a, b) => b.sessionCalls - a.sessionCalls || a.name.localeCompare(b.name))
      .slice(0, 8)
      .map(row => ({ name: row.name, value: row.sessionCalls, muted: row.disabled })),
    [board.rows],
  )

  return (
    <div className={css.view} ref={viewRef}>
      <div className={css.content}>
        {!live && (
          <div className={css.notice} role="alert">
            <span>{t('meta.sessionGone')}</span>
            <button type="button" className={css.noticeAction} onClick={() => { reload() }}>{t('error.retry')}</button>
          </div>
        )}

        <div className={css.statRow}>
          <StatCard value={String(totalCalls)} label={t('chart.totalCalls')} tone="accent" />
          <StatCard value={String(invoked)} label={t('chart.invokedSkills')} />
          <StatCard value={String(board.rows.length - invoked)} label={t('chart.unusedSkills')} />
          <StatCard value={String(disabledCount)} label={t('chart.disabledSkills')} />
        </div>

        <div className={css.chartRow}>
          <UsageDonut
            invoked={invoked}
            total={board.rows.length}
            centerLabel={t('chart.invokedSkills')}
            caption={t('chart.donutCaption', { used: String(invoked), total: String(board.rows.length) })}
          />
          <div className={css.barsWrap}>
            <p className={css.sectionTitle}>{t('chart.topSkills')}</p>
            <TopSkillsBars rows={topRows} emptyLabel={t('chart.noCalls')} />
          </div>
        </div>

        <p className={css.sectionTitle}>{t('chart.manage')}</p>
        <ul className={css.rows}>
          {board.rows.map(row => (
            <SkillToggleRow
              key={row.name}
              row={row}
              t={t}
              canToggle={live}
              onToggle={toggle}
              onOpen={() => { openDetail(row.name) }}
            />
          ))}
        </ul>
      </div>

      <SkillDetailDialog
        detail={detail}
        loading={detailLoading}
        failed={detailFailed}
        onClose={closeDetail}
        onRetry={() => { if (detailName !== undefined) openDetail(detailName) }}
        t={t}
      />
    </div>
  )
}

/** One compact skill row with its session switch. */
function SkillToggleRow({ row, t, canToggle, onToggle, onOpen }: {
  row: SkillBoardRow
  t: (key: SkillBoardKey, params?: Record<string, string>) => string
  canToggle: boolean
  onToggle: (name: string, disabled: boolean) => void
  onOpen: () => void
}): ReactNode {
  return (
    <li className={clsx(css.row, row.disabled && css.rowDisabled)}>
      <button type="button" className={css.rowOpen} onClick={onOpen} aria-label={t('action.detail')}>
        <span className={clsx(css.rowName, row.disabled && css.rowNameDisabled)}>{row.name}</span>
      </button>
      <Tag tone="quiet">{row.sources[0] ?? ''}</Tag>
      {row.sessionOverride === 'enabled' && <Tag tone="info">{t('stat.overrideEnabled')}</Tag>}
      {row.disabled && (
        <Tag tone="neutral">
          {row.sessionOverride === 'disabled' ? t('stat.disabledSession') : t('stat.disabledGlobal')}
        </Tag>
      )}
      <span className={clsx(css.rowCalls, row.sessionCalls === 0 && css.rowCallsMuted)}>
        {t('stat.calls', { count: String(row.sessionCalls) })}
      </span>
      <span className={css.rowSpacer} />
      {canToggle && (
        <Tooltip label={row.disabled ? t('toggle.enable') : t('toggle.disable')} side="left">
          <Switch
            checked={!row.disabled}
            onChange={(next) => { onToggle(row.name, !next) }}
            label={row.disabled ? t('toggle.enable') : t('toggle.disable')}
          />
        </Tooltip>
      )}
    </li>
  )
}
