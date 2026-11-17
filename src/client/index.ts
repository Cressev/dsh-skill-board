/**
 * Browser entry: re-export the plugin face from the implementation module.
 *
 * @module skill-board-plugin/client
 */
export { apply, inject, PANEL_ID } from './main.tsx'
export type { SkillBoardInjected } from './SkillBoardPage.tsx'
export type { BoardSnapshot, BoardStatus } from './board-source.ts'
export type { BoardFilter, BoardViewState } from './board-store.ts'
