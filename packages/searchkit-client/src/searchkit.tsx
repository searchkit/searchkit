import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, WatchQueryFetchPolicy } from '@apollo/client'

export interface Filter {
  id: string
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
}

export interface SearchkitClientConfig {
  itemsPerPage?: number
  apolloOptions?: SearchkitClientApolloOptionsConfig
}

export interface SearchkitClientApolloOptionsConfig {
  fetchPolicy: WatchQueryFetchPolicy
}

const filterSelector = (filter) => (f) => {
  if (filter.id !== f.id) return false
  if (filter.min && filter.max && filter.min === f.min && filter.max === f.max) return true
  if (
    filter.dateMin &&
    filter.dateMax &&
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
  private onSearch: Function
  public apolloOptions: SearchkitClientApolloOptionsConfig

  constructor(config: SearchkitClientConfig = {}) {
    this.query = ''
    this.filters = []
    this.page = {
      size: config.itemsPerPage || 10,
      from: 0
    }
    this.onSearch = null
    this.apolloOptions = config.apolloOptions
  }

  private performSearch() {
    if (this.onSearch) this.onSearch({ query: this.query, filters: this.filters, page: this.page })
  }

  setCallbackFn(callback: (variables: SearchkitQueryVariables) => any) {
    this.onSearch = callback
  }

  setQuery(query): void {
    this.query = query
    this.filters = []
    this.setPage({ from: 0, size: 10 })
  }

  getQuery(): string {
    return this.query
  }

  setPage(page: PageOptions) {
    this.page = page
  }

  search() {
    this.performSearch()
  }

  getFilters(): Filter[] {
    return this.filters
  }

  canResetSearch() {
    return !(this.filters.length === 0 && !this.query)
  }

  isFilterSelected(filter: Filter) {
    const foundFilter = this.filters.find(filterSelector(filter))
    return !!foundFilter
  }

  getFiltersById(id): Filter[] | null {
    const filters = this.filters.filter((filter) => id === filter.id)
    return filters.length > 0 ? filters : null
  }

  removeFilter(filter) {
    this.filters = this.filters.reduce((filters, f) => {
      if (filterSelector(filter)(f)) {
        return [...filters]
      }
      return [...filters, { ...f }]
    }, [])
  }

  removeFiltersById(id) {
    this.filters = this.filters.filter((f) => f.id !== id)
  }

  addFilter(filter) {
    this.filters = [{ ...filter }, ...this.filters]
  }

  toggleFilter(filter) {
    if (this.isFilterSelected(filter)) {
      this.removeFilter(filter)
    } else {
      this.addFilter(filter)
    }
  }
}

export const SearchkitContext = createContext({})

export function SearchkitProvider({ client, children }) {
  useEffect(() => {
    client.search()
  }, [])
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
  ] = useState(null)
  sk.setCallbackFn((variables) => {
    setVariables(variables)
  })
  return useQuery(query, {
    variables: {
      query: variables?.query,
      filters: variables?.filters,
      page: variables?.page
    },
    fetchPolicy: sk.apolloOptions?.fetchPolicy || 'network-only'
  })
}
