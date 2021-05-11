import React, { createContext, useContext, useEffect, useState } from 'react'
import history, { Router } from './history'

type SearchkitClientRoutingOptions = {
  stateMapping: {
    stateToRoute: (searchState: SearchState) => any
    routeToState: (routeState: any) => SearchState
  }
}

export interface Filter {
  identifier: string
  value?: string
  min?: number
  max?: number
  dateMin?: string
  dateMax?: string
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
  searchOnLoad?: boolean
  routing?: SearchkitClientRoutingOptions
}

const isDefined = (str) => typeof str !== 'undefined'

const filterSelector = (filter: Filter) => (f: Filter) => {
  if (filter.identifier !== f.identifier) return false
  if (
    isDefined(filter.min) &&
    isDefined(filter.max) &&
    filter.min === f.min &&
    filter.max === f.max
  )
    return true
  if (
    isDefined(filter.dateMin) &&
    isDefined(filter.dateMax) &&
    filter.dateMin === f.dateMin &&
    filter.dateMax === f.dateMax
  )
    return true
  if (filter.value && filter.value === f.value) return true
  return false
}

const searchStateDiff = (a: SearchState, b: SearchState) => {
  return JSON.stringify(a) !== JSON.stringify(b)
}

type SearchState = {
  query: string
  filters: Array<Filter>
  sortBy: string
  page: PageOptions
}

export class SearchkitClient {
  public searchOnLoad: boolean
  private onSearch: (variables: SearchkitQueryVariables) => void
  public routing: SearchkitClientRoutingOptions
  public searchState: SearchState
  public setSearchState: (searchState: SearchState | ((prevState: SearchState) => SearchState) ) => void

  constructor({ searchOnLoad = true, itemsPerPage = 10, routing }: SearchkitClientConfig = {}) {
    this.onSearch = null
    this.searchOnLoad = searchOnLoad
    this.routing = routing
  }

  private performSearch() {
    if (this.onSearch) this.onSearch(this.getSearchState())
  }

  public getSearchState(): SearchState {
    return this.searchState
  }

  public setCallbackFn(callback: (variables: SearchkitQueryVariables) => void) {
    this.onSearch = callback
  }

  setQuery(query: string): void {
    debugger
    this.setSearchState((searchState: SearchState) => ({
      ...searchState,
      query,
      filters: [],
      page: { from: 0, size: 10 }
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

  search(): void {
    this.performSearch()
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
    const filters = this.searchState.filters.reduce((filters, f) => {
      if (filterSelector(filter)(f)) {
        return [...filters]
      }
      return [...filters, { ...f }]
    }, [])

    this.setSearchState((prevState) => ({
      ...prevState,
      filters
    }))
  }

  removeFiltersByIdentifier(identifier: string): void {
    const filters = this.searchState.filters.filter((f) => f.identifier !== identifier)
    this.setSearchState((prevState) => ({
      ...prevState,
      filters
    }))
  }

  addFilter(filter: Filter): void {
    const filters = [{ ...filter }, ...this.searchState.filters]
    this.setSearchState((prevState) => ({
      ...prevState,
      filters
    }))
  }

  toggleFilter(filter: Filter): void {
    if (this.isFilterSelected(filter)) {
      this.removeFilter(filter)
    } else {
      this.addFilter(filter)
    }
  }

  setSortBy(sortBy: string): void {
    this.setSearchState({
      ...this.searchState,
      sortBy
    })
  }
}

export const SearchkitContext = createContext({})
export const SearchkitVariablesContext = createContext({})

export function SearchkitProvider({
  client,
  children
}: {
  client: SearchkitClient
  children: React.ReactElement
}) {
  ;[client.searchState, client.setSearchState] = useState({
    query: '',
    filters: [],
    page: {
      size: 10,
      from: 0
    },
    sortBy: null
  })
  const [pendingSearch, setPendingSearch] = useState(false)
  const [searchVariables, setSearchVariables] = useState()

  client.setCallbackFn(() => {
    setPendingSearch(true)
  })

  useEffect(() => {
    if (pendingSearch) {
      setPendingSearch(false)
      setSearchVariables(client.searchState as any)
    }
  }, [pendingSearch])

  if (!(typeof window === 'undefined')) {
    this.router = history()
    this.router.onUpdate((routeState) => {
      const searchState: SearchState = this.routing.stateMapping.routeToState(routeState)
      if (
        searchState.query !== this.searchState.query ||
        this.searchState.filters.length !== searchState.filters.length ||
        this.searchState.sortBy !== searchState.sortBy
      ) {
        this.setSearchState(searchState)
        this.performSearch()
      }
    })
  }

  useEffect(() => {
    if (client.routing) {

    }
  })

  return (
    <SearchkitContext.Provider value={client}>
      <SearchkitVariablesContext.Provider value={searchVariables}>
        {children}
      </SearchkitVariablesContext.Provider>
    </SearchkitContext.Provider>
  )
}

export function useSearchkitVariables() {
  const variables = useContext(SearchkitVariablesContext)
  return variables
}

export function useSearchkit(): SearchkitClient {
  const sk = useContext(SearchkitContext) as SearchkitClient
  return sk
}
