import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

export interface Filter {
  id: string
  value: string
  min: number
  max: number
  dateMin: string
  dateMax: string
}

export interface FilterSet {
  id: string
  selected: Array<string>
  min: number
  max: number
  dateMin: string
  dateMax: string
}

export interface PageOptions {
  size: number
  from: number
}

interface SearchkitQueryVariables {
  query: string
  filters: Array<FilterSet>
  page: PageOptions
}

export interface SearchkitClientConfig {
  itemsPerPage?: number
}

export class Searchkit {
  private query: string
  private filters: Array<Filter>
  private page: PageOptions
  private onSearch: Function

  constructor(config: SearchkitClientConfig = {}) {
    this.query = ''
    this.filters = []
    this.page = {
      size: config.itemsPerPage || 10,
      from: 0
    }
    this.onSearch = null
  }

  performSearch() {
    const filters = this.filters.reduce((sum, filter) => {
      let filterGroup = sum.find(({ id }) => id === filter.id)
      if (!filterGroup) {
        filterGroup = {
          id: filter.id,
          selected: []
        }
        return [
          ...sum,
          {
            id: filter.id,
            selected: [filter.value],
            min: filter.min,
            max: filter.max,
            dateMin: filter.dateMin,
            dateMax: filter.dateMax
          }
        ]
      }
      filterGroup.selected.push(filter.value)
      return [...sum]
    }, [])
    if (this.onSearch) this.onSearch({ query: this.query, filters, page: this.page })
  }

  setCallbackFn(callback: (variables: SearchkitQueryVariables) => any) {
    this.onSearch = callback
  }

  setQuery(query) {
    this.query = query
    this.filters = []
    this.setPage({ from: 0, size: 10 })
  }

  setPage(page: PageOptions) {
    this.page = page
  }

  search() {
    this.performSearch()
  }

  getFilters() {
    return this.filters
  }

  canResetSearch() {
    return !(this.filters.length === 0 && !this.query)
  }

  isFilterSelected(filter) {
    if ((filter.min && filter.max) || (filter.dateMin && filter.dateMax)) {
      const rangeFilterExists = this.filters.find(({ id }) => {
        id === filter.id
      })
      return rangeFilterExists
    }

    const filterExists = this.filters.find(
      ({ id, value }) => id === filter.id && filter.value === value
    )
    return !!filterExists
  }

  setFilter(filter) {
    const filterId = this.filters.find(({ id }) => id === filter.id)
    if (!filterId) {
      return this.filters.push(filter)
    }
    filterId.min = filter.min
    filterId.max = filter.max
    filterId.dateMin = filter.dateMin
    filterId.dateMax = filter.dateMax
  }

  getFilterById(id) {
    return this.filters.find((filter) => id === filter.id)
  }

  removeFilter(filter) {
    if ((filter.min && filter.max) || (filter.dateMin && filter.dateMax)) {
      this.filters = this.filters.filter(({ id, value }) => !(id === filter.id))
    } else {
      this.filters = this.filters.filter(
        ({ id, value }) => !(id === filter.id && filter.value === value)
      )
    }
  }

  toggleFilter(filter) {
    if (this.isFilterSelected(filter)) {
      this.removeFilter(filter)
    } else {
      this.filters.push(filter)
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

export function useSearchkit(): Searchkit {
  const sk = useContext(SearchkitContext) as Searchkit
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
    fetchPolicy: 'network-only'
  })
}
