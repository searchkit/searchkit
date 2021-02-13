import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'

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

export class SearchkitClient {
  private query: string
  private filters: Array<Filter>
  private page: PageOptions
  private sortBy: string
  public searchOnLoad: boolean
  private onSearch: (variables: SearchkitQueryVariables) => void

  constructor({ searchOnLoad = true, itemsPerPage = 10 }: SearchkitClientConfig = {}) {
    this.query = ''
    this.filters = []
    this.page = {
      size: itemsPerPage,
      from: 0
    }
    this.sortBy = null
    this.onSearch = null
    this.searchOnLoad = searchOnLoad
  }

  private performSearch() {
    if (this.onSearch) this.onSearch(this.getVariables())
  }

  getVariables() {
    return {
      query: this.query,
      filters: this.filters,
      page: this.page,
      sortBy: this.sortBy
    }
  }

  setCallbackFn(callback: (variables: SearchkitQueryVariables) => void) {
    this.onSearch = callback
  }

  setQuery(query: string): void {
    this.query = query
    this.filters = []
    this.setPage({ from: 0, size: 10 })
  }

  getQuery(): string {
    return this.query
  }

  setPage(page: PageOptions): void {
    this.page = page
  }

  search(): void {
    this.performSearch()
  }

  getFilters(): Filter[] {
    return this.filters
  }

  canResetSearch(): boolean {
    return !(this.filters.length === 0 && !this.query)
  }

  isFilterSelected(filter: Filter): boolean {
    const foundFilter = this.filters.find(filterSelector(filter))
    return !!foundFilter
  }

  getFiltersByIdentifier(identifier: string): Array<Filter> | null {
    const filters = this.filters.filter((filter) => identifier === filter.identifier)
    return filters.length > 0 ? filters : []
  }

  removeFilter(filter: Filter): void {
    this.filters = this.filters.reduce((filters, f) => {
      if (filterSelector(filter)(f)) {
        return [...filters]
      }
      return [...filters, { ...f }]
    }, [])
  }

  removeFiltersByIdentifier(identifier: string): void {
    this.filters = this.filters.filter((f) => f.identifier !== identifier)
  }

  addFilter(filter: Filter): void {
    this.filters = [{ ...filter }, ...this.filters]
  }

  toggleFilter(filter: Filter): void {
    if (this.isFilterSelected(filter)) {
      this.removeFilter(filter)
    } else {
      this.addFilter(filter)
    }
  }

  setSortBy(sort: string): void {
    this.sortBy = sort
  }
}

export const SearchkitContext = createContext({})

export function SearchkitProvider({
  client,
  children
}: {
  client: SearchkitClient
  children: React.ReactElement
}) {
  return <SearchkitContext.Provider value={client}>{children}</SearchkitContext.Provider>
}

export function useSearchkit(): SearchkitClient {
  const sk = useContext(SearchkitContext) as SearchkitClient
  return sk
}

export function useSearchkitQuery(query) {
  const sk = useSearchkit()
  const [variables, setVariables]: [
    SearchkitQueryVariables,
    React.Dispatch<SearchkitQueryVariables>
  ] = useState(sk.getVariables())
  const [execute, state] = useLazyQuery(query, {
    variables: {
      query: variables?.query,
      filters: variables?.filters,
      page: variables?.page,
      sortBy: variables?.sortBy
    }
  })
  useEffect(() => {
    if (sk.searchOnLoad) {
      sk.search()
    }
  }, [])
  sk.setCallbackFn((variables) => {
    setVariables(variables)
    execute()
  })
  return state
}
