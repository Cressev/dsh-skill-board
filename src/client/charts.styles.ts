/** Generated from the module stylesheet at build time; do not edit by hand. */
export const css = {
  'barFill': 'sb-charts-barFill',
  'barFillMuted': 'sb-charts-barFillMuted',
  'barName': 'sb-charts-barName',
  'barNameMuted': 'sb-charts-barNameMuted',
  'barRow': 'sb-charts-barRow',
  'barTrack': 'sb-charts-barTrack',
  'barValue': 'sb-charts-barValue',
  'bars': 'sb-charts-bars',
  'barsEmpty': 'sb-charts-barsEmpty',
  'donut': 'sb-charts-donut',
  'donutCaption': 'sb-charts-donutCaption',
  'donutFigure': 'sb-charts-donutFigure',
  'donutLegend': 'sb-charts-donutLegend',
  'donutNumber': 'sb-charts-donutNumber',
  'donutTrack': 'sb-charts-donutTrack',
  'donutValue': 'sb-charts-donutValue',
  'statCaption': 'sb-charts-statCaption',
  'statCard': 'sb-charts-statCard',
  'statCardAccent': 'sb-charts-statCardAccent',
  'statValue': 'sb-charts-statValue',
}
export const cssText = `/* Skill-board charts: stat cards, donut, and bars on semantic tokens. */

.sb-charts-statCard {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  padding: 12px 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-statCardAccent .sb-charts-statValue {
  color: var(--dsw-alias-state-business-primary);
}

.sb-charts-statValue {
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  font-variant-numeric: tabular-nums;
}

.sb-charts-statCaption {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-caption);
}

.sb-charts-donutFigure {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-donut {
  width: 128px;
  height: 128px;
}

.sb-charts-donutTrack {
  stroke: var(--dsw-alias-bg-skeleton);
}

.sb-charts-donutValue {
  stroke: var(--dsw-alias-state-business-primary);
  transition: stroke-dasharray 0.4s ease;
}

.sb-charts-donutNumber {
  font-size: 26px;
  font-weight: 500;
  fill: var(--dsw-alias-label-primary);
  font-variant-numeric: tabular-nums;
}

.sb-charts-donutCaption {
  font-size: 10px;
  fill: var(--dsw-alias-label-caption);
}

.sb-charts-donutLegend {
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  text-align: center;
}

.sb-charts-bars {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: var(--dsw-radius-md);
  background: var(--dsw-alias-bg-layer-1);
}

.sb-charts-barsEmpty {
  margin: 0;
  font-size: 13px;
  color: var(--dsw-alias-label-tertiary);
}

.sb-charts-barRow {
  display: grid;
  grid-template-columns: minmax(96px, 200px) 1fr 32px;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sb-charts-barName {
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-charts-barNameMuted {
  color: var(--dsw-alias-label-dimmed);
}

.sb-charts-barTrack {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-skeleton);
  overflow: hidden;
}

.sb-charts-barFill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: 4px;
  background: var(--dsw-alias-state-business-primary);
  opacity: 0.85;
}

.sb-charts-barFillMuted {
  opacity: 0.35;
}

.sb-charts-barValue {
  font-size: 12px;
  line-height: 16px;
  text-align: end;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}
`
