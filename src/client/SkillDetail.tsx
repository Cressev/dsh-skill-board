/**
 * Skill detail dialog: routing description, guidance, provenance, invocation
 * policy, usage and the instruction body, opened from any board row.
 */

import type { ReactNode } from 'react'
import { Modal, PathLabel, Tag } from '@deepseek-ai/dsh-client-ui-primitives'
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import type { MarkdownLabels } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SkillBoardDetail } from '../remote.ts'
import type { SkillBoardKey } from './locales.ts'
import { css } from './SkillDetail.styles.ts'

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

/** Localized Markdown chrome for the instruction body. */
function markdownLabels(t: (key: SkillBoardKey, params?: Record<string, string>) => string): MarkdownLabels {
  return {
    code: { copyLabel: t('detail.copyCode'), copiedLabel: t('detail.copiedCode') },
    footnotes: t('detail.footnotes'),
  }
}

/** One labelled metric in the detail header. */
function Metric({ value, label }: { value: string, label: string }): ReactNode {
  return (
    <div className={css.metric}>
      <span className={css.metricValue}>{value}</span>
      <span className={css.metricLabel}>{label}</span>
    </div>
  )
}

/** Props of the detail dialog. */
export interface SkillDetailDialogProps {
  /** Loaded detail, or undefined while the read is in flight. */
  readonly detail: SkillBoardDetail | undefined
  readonly loading: boolean
  readonly failed: boolean
  readonly onClose: () => void
  readonly onRetry: () => void
  readonly t: (key: SkillBoardKey, params?: Record<string, string>) => string
}

/**
 * Render the skill detail modal.
 * @param props - detail payload, load state, callbacks and translator.
 * @returns the dialog, or null when nothing was opened.
 */
export function SkillDetailDialog({ detail, loading, failed, onClose, onRetry, t }: SkillDetailDialogProps): ReactNode {
  if (detail === undefined && !loading && !failed) return null
  const perSession = detail !== undefined && detail.sessionOverride !== 'none'
  return (
    <Modal
      open
      onClose={onClose}
      closeLabel={t('detail.close')}
      title={detail?.name ?? t('detail.loading')}
      {...(css.dialog === undefined ? {} : { className: css.dialog })}
      {...(css.dialogContent === undefined ? {} : { contentClassName: css.dialogContent })}
    >
      {loading && detail === undefined && <p className={css.loading}>{t('detail.loading')}</p>}

      {failed && (
        <div className={css.notice} role="alert">
          <span>{t('detail.failed')}</span>
          <button type="button" className={css.noticeAction} onClick={onRetry}>{t('error.retry')}</button>
        </div>
      )}

      {detail !== undefined && (
        <div className={css.body}>
          <div className={css.tagRow}>
            <Tag tone={sourceTone(detail.source)}>{sourceLabel(detail.source, t)}</Tag>
            {detail.disabled && (
              <Tag tone="neutral">
                {perSession
                  ? (detail.sessionOverride === 'disabled' ? t('stat.disabledSession') : t('stat.disabledGlobal'))
                  : t('stat.disabled')}
              </Tag>
            )}
            {detail.sessionOverride === 'enabled' && <Tag tone="info">{t('stat.overrideEnabled')}</Tag>}
            {!detail.modelInvocable && <Tag tone="warning">{t('detail.modelOff')}</Tag>}
            {!detail.userInvocable && <Tag tone="warning">{t('detail.userOff')}</Tag>}
          </div>

          <div className={css.metrics}>
            <Metric value={String(detail.sessionCalls)} label={t('detail.sessionCalls')} />
            <Metric value={String(detail.sessionErrors)} label={t('detail.sessionErrors')} />
            <Metric value={String(detail.totalCalls)} label={t('detail.totalCalls')} />
          </div>

          <section className={css.section}>
            <h3 className={css.sectionTitle}>{t('detail.description')}</h3>
            <p className={css.paragraph}>{detail.description !== '' ? detail.description : t('detail.empty')}</p>
          </section>

          {detail.whenToUse !== '' && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>{t('detail.whenToUse')}</h3>
              <p className={css.paragraph}>{detail.whenToUse}</p>
            </section>
          )}

          <section className={css.section}>
            <h3 className={css.sectionTitle}>{t('detail.provenance')}</h3>
            <div className={css.provenance}>
              {detail.path !== ''
                ? <PathLabel path={detail.path} />
                : <span className={css.paragraph}>{t('detail.virtual')}</span>}
              <span className={css.provider}>{t('detail.provider', { provider: detail.provider })}</span>
            </div>
          </section>

          {detail.content !== '' && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>{t('detail.instructions')}</h3>
              <div className={css.document}>
                <MarkdownText
                  text={detail.content}
                  labels={markdownLabels(t)}
                />
              </div>
            </section>
          )}
        </div>
      )}
    </Modal>
  )
}
