import React, { createContext, useContext, useEffect, useState } from 'react'
import isEqual from 'fast-deep-equal'
import isUndefined from 'lodash/isUndefined'

export interface Filter {
  identifier: string
  value?: string
  min?: number
  max?: number
  dateMin?: string
  dateMax?: string
  level?: number
}

export interface PageOptions {
  size: number
  from: number
}

interface SearchkitQueryVariables {
  query: string
  filters: Array<Filter>
  page: PageOptions
  sortBy: string
}

export interface SearchkitClientConfig {
  itemsPerPage?: number
}

const filterSelector = (filter: Filter) => (f: Filter) => {
  if (filter.identifier !== f.identifier) return false
  if (
    !isUndefined(filter.min) &&
    !isUndefined(filter.max) &&
    filter.min === f.min &&
    filter.max === f.max
  )
    return true
  if (
    !isUndefined(filter.dateMin) &&
    !isUndefined(filter.dateMax) &&
    filter.dateMin === f.dateMin &&
    filter.dateMax === f.dateMax
  )
    return true
  if (filter.value && filter.level && filter.level === f.level && f.value === filter.value)
    return true
  if (filter.value && filter.value === f.value) return true
  return false
}

export const searchStateEqual = (a: SearchState, b: SearchState): boolean => isEqual(a, b)

export type SearchState = {
  query: string
  filters: Filter[]
  sortBy: string
  page: PageOptions
}

class SearchkitClientState {
  public searchState: SearchState
  public setSearchState: (
    searchState: SearchState | ((prevState: SearchState) => SearchState)
  ) => void

  public getSearchState(): SearchState {
    return this.searchState
  }

  setQuery(query: string): void {
    this.setSearchState((searchState: SearchState) => ({
      ...searchState,
      query,
      filters: [],
      page: { from: 0, size: searchState.page.size }
    }))
  }

  resetPage(): void {
    this.setSearchState((searchState: SearchState) => ({
      ...searchState,
      page: {
        from: 0,
        size: searchState.page.size
      }
    }))
  }

  resetFilters(): void {
    this.setSearchState((searchState: SearchState) => ({
      ...searchState,
      filters: []
    }))
  }

  getQuery(): string {
    return this.searchState.query
  }

  setPage(page: PageOptions): void {
    this.setSearchState((prevState) => ({
      ...prevState,
      page
    }))
  }

  getFilters(): Filter[] {
    return this.searchState.filters
  }

  canResetSearch(): boolean {
    return !(this.searchState.filters.length === 0 && !this.searchState.query)
  }

  isFilterSelected(filter: Filter): boolean {
    const foundFilter = this.searchState.filters.find(filterSelector(filter))
    return !!foundFilter
  }

  getFiltersByIdentifier(identifier: string): Array<Filter> | null {
    const filters = this.searchState.filters.filter((filter) => identifier === filter.identifier)
    return filters.length > 0 ? filters : []
  }

  removeFilter(filter: Filter): void {
    this.setSearchState((prevState) => {
      const filters = prevState.filters.reduce((filters, f) => {
        if (filterSelector(filter)(f)) {
          return [...filters]
        }
        return [...filters, { ...f }]
      }, [])
      return {
        ...prevState,
        filters
      }
    })
  }

  removeFiltersByIdentifier(identifier: string): void {
    this.setSearchState((prevState) => {
      const filters = prevState.filters.filter((f) => f.identifier !== identifier)
      return {
        ...prevState,
        filters
      }
    })
  }

  addFilter(filter: Filter): void {
    this.setSearchState((prevState) => {
      const filters = [{ ...filter }, ...prevState.filters]
      return {
        ...prevState,
        filters
      }
    })
  }

  toggleFilter(filter: Filter): void {
    if (this.isFilterSelected(filter)) {
      this.removeFilter(filter)
    } else {
      this.addFilter(filter)
    }
  }

  setSortBy(sortBy: string): void {
    this.setSearchState((prevState) => ({
      ...prevState,
      sortBy
    }))
  }
}

export function createSearchState(state: SearchState) {
  const searchState = Object.assign({}, state)
  const setSearchState = (fn) => {
    Object.assign(searchState, fn(searchState))
  }
  const scs = new SearchkitClientState()
  scs.setSearchState = setSearchState
  scs.searchState = searchState
  return scs
}

export class SearchkitClient extends SearchkitClientState {
  private onSearch: (variables: SearchkitQueryVariables) => void
  public baseSearchState: SearchState

  constructor({ itemsPerPage }: SearchkitClientConfig = {}) {
    super()
    this.baseSearchState = {
      query: '',
      filters: [],
      page: {
        size: itemsPerPage || 10,
        from: 0
      },
      sortBy: ''
    }
    this.onSearch = null
  }

  public updateBaseSearchState(updates: Partial<SearchState>): void {
    this.baseSearchState = {
      ...this.baseSearchState,
      ...updates,
      page: {
        ...this.baseSearchState.page,
        ...updates.page
      }
    }
  }

  private performSearch() {
    if (this.onSearch) this.onSearch(this.getSearchState())
  }

  public setCallbackFn(callback: (variables: SearchkitQueryVariables) => void) {
    this.onSearch = callback
  }

  public search(): void {
    this.performSearch()
  }
}

export const SearchkitContext = createContext({})
export const SearchkitVariablesContext = createContext({})
export const SearchkitRoutingOptionsContext = createContext(null)

export function SearchkitProvider({
  client,
  children
}: {
  client: SearchkitClient
  children: React.ReactElement
}) {
  const baseState = Object.assign({}, client.baseSearchState)
  ;[client.searchState, client.setSearchState] = useState(baseState)
  const [pendingSearch, setPendingSearch] = useState(false)
  const [searchVariables, setSearchVariables] = useState(baseState)

  client.setCallbackFn(() => {
    setPendingSearch(true)
  })

  useEffect(() => {
    if (pendingSearch) {
      setPendingSearch(false)
      setSearchVariables(client.searchState as any)
    }
  }, [pendingSearch])

  return (
    <SearchkitContext.Provider value={client}>
      <SearchkitVariablesContext.Provider value={searchVariables}>
        {children}
      </SearchkitVariablesContext.Provider>
    </SearchkitContext.Provider>
  )
}

export function useSearchkitVariables(): SearchState {
  const variables = useContext(SearchkitVariablesContext) as SearchState
  return variables
}

export function useSearchkit(): SearchkitClient {
  const sk = useContext(SearchkitContext) as SearchkitClient
  return sk
}

interface SearchkitRoutingOptions {
  routeToState: any
  stateToRoute: any
  createURL: any
  parseURL: any
}

export function useSearchkitRoutingOptions(): SearchkitRoutingOptions | null {
  return useContext(SearchkitRoutingOptionsContext) as SearchkitRoutingOptions
}

export function useSearchkitQueryValue(): [string, (a: string) => void] {
  const api = useSearchkit()
  const [query, setQuery] = useState(api.getQuery())
  useEffect(() => {
    setQuery(api.getQuery() || '')
  }, [api.searchState])

  return [query, setQuery]
}

export function useSearchkitQuery(query) {
  console.error(
    'useSearchkitQuery has now been removed. Use useSearchkitVariables hook + useQuery instead.'
  )
}
