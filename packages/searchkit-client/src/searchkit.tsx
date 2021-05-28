import React, { createContext, useContext, useEffect, useState } from 'react'
import { isUndefined } from 'lodash'
import { useQuery } from '@apollo/client'

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
  if (filter.value && filter.value === f.value) return true
  return false
}

export const searchStateEqual = (a: SearchState, b: SearchState) => {
  if (a.query !== b.query) return false
  if (a.sortBy !== b.sortBy) return false
  if (a.page.from !== b.page.from) return false
  if (a.page.size !== b.page.size) return false
  if (a.filters.length !== b.filters.length) return false

  const filterDiffs = a.filters.find((filter) => {
    const filterSelectorA = filterSelector(filter)
    if (!b.filters.find(filterSelectorA)) {
      return true
    }
    return false
  })
  if (filterDiffs) return false

  return true
}

export type SearchState = {
  query: string
  filters: Array<Filter>
  sortBy: string
  page: PageOptions
}

export class SearchkitClient {
  private onSearch: (variables: SearchkitQueryVariables) => void
  public baseSearchState: SearchState
  public searchState: SearchState
  public setSearchState: (
    searchState: SearchState | ((prevState: SearchState) => SearchState)
  ) => void

  constructor({}: SearchkitClientConfig = {}) {
    this.baseSearchState = {
      query: '',
      filters: [],
      page: {
        size: 10,
        from: 0
      },
      sortBy: null
    }
    this.onSearch = null
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

  setQuery(query: string): void {
    this.setSearchState((searchState: SearchState) => ({
      ...searchState,
      query,
      filters: [],
      page: { from: 0, size: searchState.page.size }
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

export const SearchkitContext = createContext({})
export const SearchkitVariablesContext = createContext({})

export function SearchkitProvider({
  client,
  children
}: {
  client: SearchkitClient
  children: React.ReactElement
}) {
  const baseState = client.baseSearchState
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

export function useSearchkitVariables() {
  const variables = useContext(SearchkitVariablesContext)
  return variables
}

export function useSearchkit(): SearchkitClient {
  const sk = useContext(SearchkitContext) as SearchkitClient
  return sk
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
  console.warn(
    'useSearchkitQuery has now been deprecated. Use useSearchkitVariables hook + useQuery instead.'
  )
  const variables = useSearchkitVariables()
  return useQuery(query, {
    variables
  })
}
