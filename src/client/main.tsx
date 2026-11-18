/**
 * Client plugin for the skill board: sidebar entry plus the main panel page.
 *
 * The `skillBoard` remote namespace is hand-written and mounted in a child
 * fiber (the proven temporary-session pattern); the page reads the aggregated
 * catalog through a lazily-subscribing observable source.
 *
 * @module skill-board-plugin/client
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import { skillBoardRemote, type SkillBoardCatalog } from '../remote.ts'
import { BoardSource, type SkillBoardApi } from './board-source.ts'
import { createBoardStore } from './board-store.ts'
import { en, NS, zh, type SkillBoardKey } from './locales.ts'
import { SkillPanelIcon } from './SkillPanelIcon.tsx'
import { SkillBoardPage } from './SkillBoardPage.tsx'
import { cssText as detailCss } from './SkillDetail.styles.ts'
import { cssText as pageCss } from './SkillBoardPage.styles.ts'
import { cssText as sessionCss } from './SessionSkillBoard.styles.ts'
import { cssText as chartsCss } from './charts.styles.ts'
import { SessionSkillBoard } from './SessionSkillBoard.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Skill board page copy. */
    skillBoard: SkillBoardKey
  }
}

/** Panel id shared by the sidebar entry and the main panel registration. */
export const PANEL_ID = 'skillBoard' as MainPanelId

/** Required services: slots, locale, remote, layout. */
export const inject = ['slots', 'locale', 'remote', 'layout']

/**
 * Client plugin body: dictionaries, the remote mount, and both registrations.
 * @param ctx - client root context.
 */
/** Append the board stylesheets once per page (the bundle ships styles inline). */
function injectStyles(): void {
  const marker = 'dsh-skill-board-styles'
  if (document.getElementById(marker) !== null) return
  const style = document.createElement('style')
  style.id = marker
  style.textContent = [chartsCss, sessionCss, pageCss, detailCss].join('\n')
  document.head.appendChild(style)
}

export function apply(ctx: ClientContext): void {
  injectStyles()
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'skillBoard: dictionaries')
  ctx.plugin(async (owner) => {
    await owner.remote.$mount(skillBoardRemote)
    owner.inject(['remote.skillBoard'], (scope) => {
      const api = scope.remote.skillBoard as unknown as SkillBoardApi
      const source = new BoardSource(api)
      const handle = createBoardStore()
      const instance = handle.create()
      const store = { ...handle, create: () => instance }
      ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        locale: NS,
        store,
        inject: () => ({
          load: (sessionId?: string) => source.load(sessionId),
          setDisabled: (name: string, disabled: boolean) => source.setDisabled(name, disabled),
          setGlobalDisabled: (name: string, disabled: boolean) => source.setGlobalDisabled(name, disabled),
          readDetail: (name: string) => source.detail(name),
          reset: () => source.reset(),
          hooks: { board: source },
        }),
      }, SkillBoardPage)), 'skillBoard: main panel')
      const sessionSources = new Map<string, BoardSource>()
      ctx.effect(() => ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'skills',
        order: 11,
        locale: NS,
        label: () => t('view.skills'),
        inject: (sessionId: string) => {
          let source = sessionSources.get(sessionId)
          if (source === undefined) {
            source = new BoardSource(api)
            // Prime the source for this session before the first subscriber
            // attaches, so the view opens on this session's numbers, not the
            // global snapshot a bare load() would fetch.
            source.load(sessionId)
            sessionSources.set(sessionId, source)
          }
          return {
            toggle: (name: string, disabled: boolean) => { source?.setDisabled(name, disabled) },
            reload: () => { source?.load(sessionId) },
            readDetail: (name: string) => source === undefined ? Promise.resolve(undefined) : source.detail(name),
            hooks: { board: source },
          }
        },
      }, SessionSkillBoard)), 'skillBoard: session view')
      ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 20,
        locale: NS,
        label: () => t('panel'),
      }, SkillPanelIcon)), 'skillBoard: sidebar entry')
    })
  })
}
