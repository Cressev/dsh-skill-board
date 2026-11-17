/** Generated from the module stylesheet at build time; do not edit by hand. */
export const css = {
  'bars': 'sb-session-bars',
  'barsWrap': 'sb-session-barsWrap',
  'chartRow': 'sb-session-chartRow',
  'content': 'sb-session-content',
  'notice': 'sb-session-notice',
  'noticeAction': 'sb-session-noticeAction',
  'row': 'sb-session-row',
  'rowCalls': 'sb-session-rowCalls',
  'rowCallsMuted': 'sb-session-rowCallsMuted',
  'rowDisabled': 'sb-session-rowDisabled',
  'rowName': 'sb-session-rowName',
  'rowNameDisabled': 'sb-session-rowNameDisabled',
  'rowSpacer': 'sb-session-rowSpacer',
  'rows': 'sb-session-rows',
  'sectionTitle': 'sb-session-sectionTitle',
  'statRow': 'sb-session-statRow',
  'view': 'sb-session-view',
}
export const cssText = `/* The per-session Skill view: stat row, charts, and manage rows. */

.sb-session-view {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-session-content {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 24px clamp(20px, 3vw, 40px) 160px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sb-session-notice {
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

.sb-session-noticeAction {
  border: none;
  background: none;
  padding: 2px 6px;
  border-radius: var(--dsw-radius-xs);
  color: var(--dsw-alias-link);
  font-size: 13px;
  cursor: pointer;
}

.sb-session-statRow {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.sb-session-chartRow {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: stretch;
  min-width: 0;
}

.sb-session-barsWrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-session-barsWrap .sb-session-bars {
  padding: 0;
  background: none;
}

.sb-session-sectionTitle {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-session-rows {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
  overflow: hidden;
}

.sb-session-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 9px 14px;
}

@media (hover: hover) {
  .sb-session-row:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

.sb-session-row + .sb-session-row {
  border-top: 0.5px solid var(--dsw-alias-border-l1);
}

.sb-session-rowDisabled .sb-session-rowName {
  color: var(--dsw-alias-label-tertiary);
}

.sb-session-rowName {
  font-size: 13px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.sb-session-rowNameDisabled {
  color: var(--dsw-alias-label-tertiary);
}

.sb-session-rowCalls {
  font-size: 12px;
  color: var(--dsw-alias-label-caption);
  white-space: nowrap;
}

.sb-session-rowSpacer {
  flex: 1;
}

@media (max-width: 767px) {
  .sb-session-statRow {
    flex-wrap: wrap;
  }

  .sb-session-chartRow {
    grid-template-columns: 1fr;
  }
}

.sb-session-rowCallsMuted {
  color: var(--dsw-alias-label-dimmed);
}
`
