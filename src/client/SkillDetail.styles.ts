/** Generated for the skill detail dialog; do not edit by hand. */
export const css: Record<string, string | undefined> = {
  'body': 'sb-detail-body',
  'dialog': 'sb-detail-dialog',
  'dialogContent': 'sb-detail-dialogContent',
  'document': 'sb-detail-document',
  'loading': 'sb-detail-loading',
  'metric': 'sb-detail-metric',
  'metricLabel': 'sb-detail-metricLabel',
  'metricValue': 'sb-detail-metricValue',
  'metrics': 'sb-detail-metrics',
  'notice': 'sb-detail-notice',
  'noticeAction': 'sb-detail-noticeAction',
  'paragraph': 'sb-detail-paragraph',
  'provenance': 'sb-detail-provenance',
  'provider': 'sb-detail-provider',
  'section': 'sb-detail-section',
  'sectionTitle': 'sb-detail-sectionTitle',
  'tagRow': 'sb-detail-tagRow',
}
export const cssText = `/* Skill detail dialog. */

.sb-detail-dialog {
  width: min(760px, 92vw);
  /* Cap the dialog so its header never scrolls out of view; the body below
   * owns the scroll. */
  max-height: min(86vh, 760px);
}

.sb-detail-dialogContent {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-inline-end: 4px;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-detail-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sb-detail-tagRow {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sb-detail-metrics {
  display: flex;
  gap: 10px;
}

.sb-detail-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding: 10px 14px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-detail-metricValue {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}

.sb-detail-metricLabel {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.sb-detail-sectionTitle {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-paragraph {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
}

.sb-detail-provenance {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.sb-detail-provider {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-detail-document {
  max-height: min(38vh, 360px);
  overflow: auto;
  padding: 12px 14px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-detail-loading {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-detail-notice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--dsw-radius-sm);
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

.sb-detail-noticeAction {
  border: none;
  background: none;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-xs);
  color: var(--dsw-alias-link);
  font-size: 13px;
  cursor: pointer;
}

@media (max-width: 767px) {
  .sb-detail-metrics {
    flex-wrap: wrap;
  }
}
`
