/** Board view state: the search query and the invocation filter. */
import { defineStore, type EngineStoreHandle } from '@deepseek-ai/dsh-client-store'

/** Invocation filter values. */
export type BoardFilter = 'all' | 'invoked' | 'unused'

/** Board view state shape. */
export interface BoardViewState {
  query: string
  filter: BoardFilter
}

/**
 * Create the board view store.
 * @returns store handle shared by the page registration.
 */
export function createBoardStore(): EngineStoreHandle<BoardViewState, {
  setQuery: (draft: BoardViewState, query: string) => void
  setFilter: (draft: BoardViewState, filter: BoardFilter) => void
}> {
  return defineStore({
    init: () => ({ query: '', filter: 'all' }),
    actions: {
      setQuery: (draft, query) => { draft.query = query },
      setFilter: (draft, filter) => { draft.filter = filter },
    },
  })
}
