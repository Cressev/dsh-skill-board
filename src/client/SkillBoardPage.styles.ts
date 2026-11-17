/** Generated from the module stylesheet at build time; do not edit by hand. */
export const css = {
  'barsWrap': 'sb-page-barsWrap',
  'boardMeta': 'sb-page-boardMeta',
  'boardMetaHidden': 'sb-page-boardMetaHidden',
  'card': 'sb-page-card',
  'cardDescription': 'sb-page-cardDescription',
  'cardDisabled': 'sb-page-cardDisabled',
  'cardMain': 'sb-page-cardMain',
  'cardMeta': 'sb-page-cardMeta',
  'cardName': 'sb-page-cardName',
  'cardNameDisabled': 'sb-page-cardNameDisabled',
  'cardTitleRow': 'sb-page-cardTitleRow',
  'cards': 'sb-page-cards',
  'chartRow': 'sb-page-chartRow',
  'controls': 'sb-page-controls',
  'empty': 'sb-page-empty',
  'emptyDescription': 'sb-page-emptyDescription',
  'emptyTitle': 'sb-page-emptyTitle',
  'filterTabs': 'sb-page-filterTabs',
  'metaDot': 'sb-page-metaDot',
  'notice': 'sb-page-notice',
  'page': 'sb-page-page',
  'pageActions': 'sb-page-pageActions',
  'pageContent': 'sb-page-pageContent',
  'pageHead': 'sb-page-pageHead',
  'pageHeading': 'sb-page-pageHeading',
  'pageSubtitle': 'sb-page-pageSubtitle',
  'pageTitle': 'sb-page-pageTitle',
  'resetDescription': 'sb-page-resetDescription',
  'search': 'sb-page-search',
  'sessionPicker': 'sb-page-sessionPicker',
  'skeletonBar': 'sb-page-skeletonBar',
  'skeletonStat': 'sb-page-skeletonStat',
  'skeletonText': 'sb-page-skeletonText',
  'skeletonTile': 'sb-page-skeletonTile',
  'skeletonTitle': 'sb-page-skeletonTitle',
  'statBlock': 'sb-page-statBlock',
  'statBlockIdle': 'sb-page-statBlockIdle',
  'statLabel': 'sb-page-statLabel',
  'statNumber': 'sb-page-statNumber',
  'statRow': 'sb-page-statRow',
  'statTime': 'sb-page-statTime',
  'tile': 'sb-page-tile',
}
export const cssText = `/* Skill board page: layout, cards, and states on --dsw-* semantic tokens. */

.sb-page-page {
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 1.6;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  --dsh-scrollbar-width: 9px;
}

.sb-page-pageContent {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 32px clamp(24px, 4vw, 48px) 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  min-width: 0;
}

.sb-page-pageHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

.sb-page-pageHeading {
  min-width: 0;
}

.sb-page-pageTitle {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  overflow-wrap: anywhere;
}

.sb-page-pageSubtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}

.sb-page-pageActions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.sb-page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.sb-page-search {
  flex: 1;
  min-width: 0;
}

.sb-page-filterTabs {
  flex-shrink: 0;
}

.sb-page-boardMeta {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-caption);
}

.sb-page-boardMetaHidden {
  visibility: hidden;
}

.sb-page-metaDot {
  margin: 0 6px;
  color: var(--dsw-alias-label-dimmed);
}

.sb-page-notice {
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

.sb-page-cards {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  min-width: 0;
}

.sb-page-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 0 -12px;
  min-width: 0;
  border-radius: var(--dsw-radius-lg);
}

@media (hover: hover) {
  .sb-page-card:hover {
    background: var(--dsw-alias-interactive-bg-hover);
  }
}

.sb-page-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 0.5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-md);
  color: var(--dsw-alias-label-secondary);
}

.sb-page-cardMain {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.sb-page-cardTitleRow {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
}

.sb-page-cardName {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  overflow-wrap: anywhere;
}

.sb-page-cardDescription {
  margin: 0;
  font-size: 13px;
  line-height: 19px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.sb-page-cardMeta {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-caption);
}

/* Right-side invocation stat block: the board's primary metric. */

.sb-page-statBlock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  flex-shrink: 0;
  min-width: 72px;
  text-align: right;
}

.sb-page-statBlockIdle {
  opacity: 0.55;
}

.sb-page-statNumber {
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}

.sb-page-statLabel {
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-statTime {
  font-size: 11px;
  line-height: 14px;
  color: var(--dsw-alias-label-caption);
  margin-top: 1px;
}

/* Loading skeleton: one treatment for the first read. */

.sb-page-skeletonTile {
  background: var(--dsw-alias-bg-skeleton);
  border: 0;
}

.sb-page-skeletonBar {
  height: 12px;
  border-radius: var(--dsw-radius-xs);
  background: var(--dsw-alias-bg-skeleton);
}

.sb-page-skeletonTitle {
  width: 38%;
}

.sb-page-skeletonText {
  width: 72%;
}

.sb-page-skeletonStat {
  width: 56px;
  height: 22px;
}

/* Empty state. */

.sb-page-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 64px 24px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-emptyTitle {
  margin: 0;
  font-size: 14px;
  color: var(--dsw-alias-label-secondary);
}

.sb-page-emptyDescription {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-page-resetDescription {
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-secondary);
}

@media (max-width: 900px) {
  .sb-page-controls {
    flex-wrap: wrap;
  }

  .sb-page-search {
    flex-basis: 100%;
  }

  .sb-page-filterTabs {
    flex: 1;
    min-width: 0;
  }
}

@media (max-width: 767px) {
  .sb-page-pageContent {
    padding: 24px 20px 40px;
  }

  .sb-page-pageHead {
    flex-wrap: wrap;
  }

  .sb-page-statBlock {
    min-width: 60px;
  }
}

/* Session picker and per-session toggle. */

.sb-page-sessionPicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  max-width: 220px;
}

.sb-page-cardDisabled .sb-page-tile {
  opacity: 0.55;
}

.sb-page-cardNameDisabled {
  color: var(--dsw-alias-label-tertiary);
}

/* Chart section of the global panel. */

.sb-page-statRow {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.sb-page-chartRow {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: stretch;
  min-width: 0;
}

.sb-page-barsWrap {
  min-width: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-page-barsWrap > div {
  padding: 0;
  background: none;
}

@media (max-width: 767px) {
  .sb-page-statRow {
    flex-wrap: wrap;
  }

  .sb-page-chartRow {
    grid-template-columns: 1fr;
  }
}
`
