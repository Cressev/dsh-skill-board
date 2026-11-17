/**
 * Pure-CSS/SVG charts for the skill board: an overview stat row, a usage
 * donut, and a horizontal bar list. No chart library — everything derives
 * from --dsw-* semantic tokens so both themes stay correct.
 */

import type { ReactNode } from 'react'
import clsx from 'clsx'
import { css } from './charts.styles'

/** One summary number with a caption. */
export function StatCard({ value, label, tone }: { value: string, label: string, tone?: 'accent' }): ReactNode {
  return (
    <div className={clsx(css.statCard, tone === 'accent' && css.statCardAccent)}>
      <span className={css.statValue}>{value}</span>
      <span className={css.statCaption}>{label}</span>
    </div>
  )
}

/**
 * Donut of invoked vs unused skills with the invoked count in the middle.
 * @param props.invoked - count of skills with at least one call.
 * @param props.total - all skills on the board.
 * @param props.centerLabel - caption under the center number.
 */
export function UsageDonut({ invoked, total, centerLabel, caption }: {
  invoked: number
  total: number
  centerLabel: string
  caption: string
}): ReactNode {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const fraction = total > 0 ? Math.min(1, invoked / total) : 0
  // Keep a visible sliver for any nonzero share; a true zero draws nothing.
  const visible = invoked > 0 ? Math.max(fraction, 0.04) : 0
  const dash = visible * circumference
  return (
    <figure className={css.donutFigure}>
      <svg viewBox="0 0 112 112" className={css.donut} role="img" aria-label={caption}>
        <circle cx="56" cy="56" r={radius} className={css.donutTrack} strokeWidth="10" fill="none" />
        <circle
          cx="56" cy="56" r={radius}
          className={css.donutValue}
          strokeWidth="10" fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 56 56)"
        />
        <text x="56" y="53" textAnchor="middle" className={css.donutNumber}>{`${Math.round(fraction * 100)}%`}</text>
        <text x="56" y="70" textAnchor="middle" className={css.donutCaption}>{centerLabel}</text>
      </svg>
      <figcaption className={css.donutLegend}>{caption}</figcaption>
    </figure>
  )
}

/** One row of the bar list. */
export interface BarRow {
  readonly name: string
  readonly value: number
  readonly muted?: boolean
}

/**
 * Horizontal bars for the top skills by call count.
 * @param props.rows - one row per skill, already sorted and truncated.
 * @param props.emptyLabel - caption when no skill has calls.
 */
export function TopSkillsBars({ rows, emptyLabel }: { rows: readonly BarRow[], emptyLabel: string }): ReactNode {
  const max = rows.reduce((top, row) => Math.max(top, row.value), 0)
  return (
    <div className={css.bars}>
      {rows.length === 0
        ? <p className={css.barsEmpty}>{emptyLabel}</p>
        : rows.map(row => (
          <div key={row.name} className={css.barRow} title={`${row.name}: ${row.value}`}>
            <span className={clsx(css.barName, row.muted && css.barNameMuted)}>{row.name}</span>
            <span className={css.barTrack}>
              <span
                className={clsx(css.barFill, row.muted && css.barFillMuted)}
                style={{ width: row.value > 0 && max > 0 ? `${Math.max(4, Math.round(row.value / max * 100))}%` : '0%' }}
              />
            </span>
            <span className={css.barValue}>{String(row.value)}</span>
          </div>
        ))}
    </div>
  )
}
