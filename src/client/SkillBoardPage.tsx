/**
 * Skill board page: pick a session, search and filter its skills, read each
 * skill's usage for that session, and toggle skills per session. Follows the
 * Plugins page's layout conventions.
 */

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import {
  Button, IconChevronDownOutlineRegular, IconSearchOutlineRegular, Input, Menu, MenuItemButton, Modal, SegmentedTabs, Switch, Tag, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { IconSparkleRegular, relativeTime } from '@deepseek-ai/dsh-client-ui-primitives'
import { StatCard, TopSkillsBars, UsageDonut } from './charts.tsx'
import { SkillDetailDialog } from './SkillDetail.tsx'
import { cssText as detailCss } from './SkillDetail.styles.ts'
import type { SkillBoardDetail } from '../remote.ts'
import type { InjectFace, PropsLocale, PropsStore, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { BoardSource, BoardSnapshot } from './board-source.ts'
import type { BoardFilter, BoardViewState } from './board-store.ts'
import type { createBoardStore } from './board-store.ts'
import type { SkillBoardRow, SkillBoardSession } from '../remote.ts'
import type { SkillBoardKey } from './locales.ts'
import { css } from './SkillBoardPage.styles'

/** Injected face: data source hooks and actions. */
export interface SkillBoardInjected {
  /** Re-read the catalog for a session; failures keep the previous rows. */
  readonly load: (sessionId?: string) => void
  /** Toggle one skill for the selected session. */
  readonly setDisabled: (name: string, disabled: boolean) => void
  /** Toggle one skill's global default from the global view. */
  readonly setGlobalDisabled: (name: string, disabled: boolean) => void
  /** Read one skill's full detail. */
  readonly readDetail: (name: string) => Promise<SkillBoardDetail | undefined>
  /** Clear global invocation counters on the host. */
  readonly reset: () => void
}

/** Full props of the board page. */
export type SkillBoardPageProps =
  PropsRuntime<'main'>
  & PropsLocale<'skillBoard'>
  & InjectFace<SkillBoardInjected & { readonly hooks: { readonly board: BoardSource } }>
  & PropsStore<ReturnType<typeof createBoardStore>>

/** Tag tone per skill source: project sources read as informational. */
function sourceTone(source: string): 'quiet' | 'info' | 'neutral' {
  if (source.startsWith('project-')) return 'info'
  if (source.startsWith('user-')) return 'quiet'
  return 'neutral'
}

/** Localize one source id. */
function sourceLabel(source: string, t: (key: SkillBoardKey) => string): string {
  const labels: Record<string, string> = {
    'source.user-dsh': t('source.user-dsh'),
    'source.user-agents': t('source.user-agents'),
    'source.project-dsh': t('source.project-dsh'),
    'source.project-agents': t('source.project-agents'),
    'source.custom': t('source.custom'),
    'source.bundled': t('source.bundled'),
    'source.runtime': t('source.runtime'),
  }
  return labels[source] ?? source
}

/** Localized relative-time bucket. */
function relativeLabel(at: number, now: number, t: (key: SkillBoardKey, params?: Record<string, string>) => string): string {
  const bucket = relativeTime(at, now)
  switch (bucket.unit) {
    case 'now': return t('time.now')
    case 'minutes': return t('time.minutes', { n: String(bucket.n) })
    case 'hours': return t('time.hours', { n: String(bucket.n) })
    case 'days': return t('time.days', { n: String(bucket.n) })
    case 'months': return t('time.months', { n: String(bucket.n) })
    default: return t('time.years', { n: String(bucket.n) })
  }
}

/** Short display label of one pickable session. */
function sessionLabel(session: SkillBoardSession, t: (key: SkillBoardKey, params?: Record<string, string>) => string): string {
  if (session.title !== '') return session.title
  return t('session.fallback', { id: session.sessionId.slice(-6) })
}

/**
 * The skill board main panel.
 * @param props - locale, injected source, and view-store shares.
 * @returns the assembled page.
 */
export function SkillBoardPage(props: SkillBoardPageProps): ReactNode {
  const { t, useBoard, load, setDisabled, setGlobalDisabled, readDetail, reset, useStore, actions } = props
  const board = useBoard((snapshot: BoardSnapshot) => snapshot)
  const query = useStore((state: BoardViewState) => state.query)
  const filter = useStore((state: BoardViewState) => state.filter)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [detailName, setDetailName] = useState<string | undefined>(undefined)
  const [detail, setDetail] = useState<SkillBoardDetail | undefined>(undefined)
  const [detailFailed, setDetailFailed] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

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
  const now = Date.now()
  const perSession = board.sessionId !== ''

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return board.rows.filter(row =>
      (filter === 'all' || (filter === 'invoked' ? (perSession ? row.sessionCalls : row.totalCalls) > 0 : (perSession ? row.sessionCalls : row.totalCalls) === 0))
      && (needle === '' || row.name.toLowerCase().includes(needle) || row.description.toLowerCase().includes(needle)))
  }, [board.rows, query, filter, perSession])

  const invokedCount = useMemo(
    () => board.rows.reduce((sum, row) => sum + ((perSession ? row.sessionCalls : row.totalCalls) > 0 ? 1 : 0), 0),
    [board.rows, perSession],
  )
  const showSkeleton = board.status === 'loading' && !board.populated
  const showError = board.status === 'error'
  const showEmpty = board.status === 'ready' && rows.length === 0

  return (
    <div className={css.page}>
      <div className={css.pageContent}>
        <header className={css.pageHead}>
          <div className={css.pageHeading}>
            <h1 className={css.pageTitle}>{t('title')}</h1>
            <p className={css.pageSubtitle}>{t('subtitle')}</p>
          </div>
          <div className={css.pageActions}>
            <Button variant="ghost" size="sm" onClick={() => { load() }}>{t('action.refresh')}</Button>
            <Button variant="outline" size="sm" disabled={!board.populated} onClick={() => { setResetOpen(true) }}>
              {t('action.reset')}
            </Button>
          </div>
        </header>

        <div className={css.controls}>
          <Menu
            open={pickerOpen}
            onClose={() => { setPickerOpen(false) }}
            align="start"
            portal
            dense
            anchor={(
              <Button
                variant="outline"
                size="sm"
                className={css.sessionPicker}
                aria-label={t('session.picker')}
                aria-haspopup="menu"
                aria-expanded={pickerOpen}
                onClick={() => { setPickerOpen(value => !value) }}
              >
                {perSession
                  ? (board.sessionTitle !== '' ? board.sessionTitle : board.sessionId.slice(-8))
                  : t('session.global')}
                <IconChevronDownOutlineRegular size={12} />
              </Button>
            )}
          >
            <MenuItemButton current={!perSession} onSelect={() => { setPickerOpen(false); load('') }}>
              {t('session.global')}
            </MenuItemButton>
            {board.sessions.map(session => (
              <MenuItemButton
                key={session.sessionId}
                current={session.sessionId === board.sessionId}
                onSelect={() => { setPickerOpen(false); load(session.sessionId) }}
              >
                {sessionLabel(session, t)}
              </MenuItemButton>
            ))}
          </Menu>
          <Input
            className={css.search}
            type="search"
            icon={<IconSearchOutlineRegular />}
            aria-label={t('search.label')}
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(event) => { actions.setQuery(event.target.value) }}
          />
          <SegmentedTabs
            className={css.filterTabs}
            size="sm"
            label={t('filter.label')}
            value={filter}
            onChange={(value) => { actions.setFilter(value as BoardFilter) }}
            items={[
              { value: 'all', label: t('filter.all'), id: 'skill-board-tab-all', panelId: 'skill-board-panel' },
              { value: 'invoked', label: t('filter.invoked'), id: 'skill-board-tab-invoked', panelId: 'skill-board-panel' },
              { value: 'unused', label: t('filter.unused'), id: 'skill-board-tab-unused', panelId: 'skill-board-panel' },
            ]}
          />
        </div>

        <p className={clsx(css.boardMeta, rows.length === 0 && board.rows.length > 0 && css.boardMetaHidden)}>
          {perSession
            ? (board.sessionLive ? t('meta.session', { title: board.sessionTitle !== '' ? board.sessionTitle : board.sessionId.slice(-8) }) : t('meta.sessionGone'))
            : t('meta.global')}
          <span className={css.metaDot}>·</span>
          {t('meta.skills', { count: String(board.rows.length) })}
          <span className={css.metaDot}>·</span>
          {t('meta.since', { date: new Date(board.trackedSince).toLocaleDateString() })}
        </p>

        {!showSkeleton && board.rows.length > 0 && (
          <>
            <div className={css.statRow}>
              <StatCard value={String(board.rows.reduce((sum, row) => sum + (perSession ? row.sessionCalls : row.totalCalls), 0))} label={t('chart.totalCalls')} tone="accent" />
              <StatCard value={String(invokedCount)} label={t('chart.invokedSkills')} />
              <StatCard value={String(board.rows.length - invokedCount)} label={t('chart.unusedSkills')} />
              <StatCard value={String(board.rows.filter(row => row.disabled).length)} label={t('chart.disabledSkills')} />
            </div>
            <div className={css.chartRow}>
              <UsageDonut
                invoked={invokedCount}
                total={board.rows.length}
                centerLabel={t('chart.invokedSkills')}
                caption={t('chart.donutCaption', { used: String(invokedCount), total: String(board.rows.length) })}
              />
              <div className={css.barsWrap}>
                <TopSkillsBars
                  rows={[...board.rows]
                    .sort((a, b) => (perSession ? b.sessionCalls - a.sessionCalls : b.totalCalls - a.totalCalls) || a.name.localeCompare(b.name))
                    .slice(0, 8)
                    .map(row => ({ name: row.name, value: perSession ? row.sessionCalls : row.totalCalls, muted: row.disabled }))}
                  emptyLabel={t('chart.noCalls')}
                />
              </div>
            </div>
          </>
        )}

        {showError && (
          <div className={css.notice} role="alert">
            <span>{t('error')}</span>
            <Button variant="ghost" size="sm" onClick={() => { load() }}>{t('error.retry')}</Button>
          </div>
        )}

        {showSkeleton && (
          <ul className={css.cards} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map(index => (
              <li key={index} className={css.card}>
                <div className={clsx(css.tile, css.skeletonTile)} />
                <div className={css.cardMain}>
                  <div className={clsx(css.skeletonBar, css.skeletonTitle)} />
                  <div className={clsx(css.skeletonBar, css.skeletonText)} />
                </div>
                <div className={clsx(css.skeletonBar, css.skeletonStat)} />
              </li>
            ))}
          </ul>
        )}

        {showEmpty && (
          <div className={css.empty}>
            <IconSparkleRegular size={28} />
            <p className={css.emptyTitle}>{board.rows.length === 0 ? t('empty.none') : t('empty.title')}</p>
            {board.rows.length > 0 && <p className={css.emptyDescription}>{t('empty.description')}</p>}
          </div>
        )}

        {!showSkeleton && rows.length > 0 && (
          <ul className={css.cards}>
            {rows.map(row => (
              <SkillCard
                key={row.name}
                row={row}
                now={now}
                perSession={perSession}
                canToggle={perSession ? board.sessionLive : true}
                t={t}
                onToggle={(next) => {
                  if (perSession) setDisabled(row.name, next)
                  else setGlobalDisabled(row.name, next)
                }}
                onOpen={() => { openDetail(row.name) }}
              />
            ))}
          </ul>
        )}

        <SkillDetailDialog
          detail={detail}
          loading={detailLoading}
          failed={detailFailed}
          onClose={closeDetail}
          onRetry={() => { if (detailName !== undefined) openDetail(detailName) }}
          t={t}
        />

        <Modal
          open={resetOpen}
          onClose={() => { setResetOpen(false) }}
          title={t('reset.title')}
          closeLabel={t('reset.cancel')}
          footer={(
            <>
              <Button variant="ghost" size="sm" onClick={() => { setResetOpen(false) }}>{t('reset.cancel')}</Button>
              <Button variant="primary" size="sm" onClick={() => { setResetOpen(false); reset() }}>{t('reset.confirm')}</Button>
            </>
          )}
        >
          <p className={css.resetDescription}>{t('reset.description')}</p>
        </Modal>
      </div>
    </div>
  )
}

/** One skill card row: identity and toggle on the left, usage stats on the right. */
function SkillCard({ row, now, perSession, canToggle, t, onToggle, onOpen }: {
  row: SkillBoardRow
  now: number
  perSession: boolean
  canToggle: boolean
  t: SkillBoardPageProps['t']
  onToggle: (next: boolean) => void
  onOpen: () => void
}): ReactNode {
  const calls = perSession ? row.sessionCalls : row.totalCalls
  const lastAt = perSession ? row.sessionLastCalledAt : row.lastCalledAt
  const lastLabel = lastAt > 0 ? relativeLabel(lastAt, now, t) : ''
  return (
    <li className={clsx(css.card, row.disabled && css.cardDisabled)}>
      <button type="button" className={css.cardOpen} onClick={onOpen} aria-label={t('action.detail')}>
        <div className={css.tile}><IconSparkleRegular size={18} /></div>
        <div className={css.cardMain}>
        <div className={css.cardTitleRow}>
          <span className={clsx(css.cardName, row.disabled && css.cardNameDisabled)}>{row.name}</span>
          {row.sessionOverride === 'enabled' && <Tag tone="info">{t('stat.overrideEnabled')}</Tag>}
          {row.disabled && (
            <Tag tone="neutral">
              {perSession
                ? (row.sessionOverride === 'disabled' ? t('stat.disabledSession') : t('stat.disabledGlobal'))
                : t('stat.disabled')}
            </Tag>
          )}
          {row.sources.map(source => (
            <Tag key={source} tone={sourceTone(source)}>{sourceLabel(source, t)}</Tag>
          ))}
          {row.sessionErrors > 0 && (
            <Tooltip label={t('stat.errors', { count: String(row.sessionErrors) })} side="bottom">
              <Tag tone="danger">{t('stat.errors', { count: String(row.sessionErrors) })}</Tag>
            </Tooltip>
          )}
        </div>
          {row.description !== '' && <p className={css.cardDescription}>{row.description}</p>}
        </div>
      </button>
      <div className={clsx(css.statBlock, calls === 0 && css.statBlockIdle)}>
        <span className={css.statNumber}>{calls}</span>
        <span className={css.statLabel}>{t('stat.callsUnit')}</span>
        {lastLabel !== '' && <span className={css.statTime}>{lastLabel}</span>}
      </div>
      {canToggle && (
        <Tooltip label={row.disabled ? t('toggle.enable') : t('toggle.disable')} side="left">
          <Switch
            checked={!row.disabled}
            onChange={(next) => { onToggle(!next) }}
            label={row.disabled ? t('toggle.enable') : t('toggle.disable')}
          />
        </Tooltip>
      )}
    </li>
  )
}
