import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

export interface Filter {
  id: string
  value: string
}

export interface FilterSet {
  id: string
  selected: Array<string>
}

interface SearchkitQueryVariables {
  query: string
  filters: Array<FilterSet>
}

export class Searchkit {
  private query: string
  private filters: Array<Filter>
  private onSearch: Function

  constructor() {
    this.query = ''
    this.filters = []
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
        return [...sum, { id: filter.id, selected: [filter.value] }]
      }
      filterGroup.selected.push(filter.value)
      return [...sum]
    }, [])
    if (this.onSearch) this.onSearch({ query: this.query, filters: filters })
  }

  setCallbackFn(callback: (variables: SearchkitQueryVariables) => any) {
    this.onSearch = callback
  }

  setQuery(query) {
    this.query = query
    this.filters = []
  }

  search() {
    this.performSearch()
  }

  getFilters() {
    return this.filters
  }

  toggleFilter(filter) {
    const filterExists = this.filters.find(
      ({ id, value }) => id === filter.id && filter.value === value
    )
    if (filterExists) {
      this.filters = this.filters.filter(
        ({ id, value }) => !(id === filter.id && filter.value === value)
      )
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
      filters: variables?.filters
    },
    fetchPolicy: 'network-only'
  })
}
