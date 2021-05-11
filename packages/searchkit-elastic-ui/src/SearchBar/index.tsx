import { useSearchkit } from '@searchkit/client'
import { EuiFieldSearch } from '@elastic/eui'
import React, { useState } from 'react'
import { useEffect } from 'react'

function useQuery() {
  const api = useSearchkit()
  const [query, setQuery] = useState(api.getQuery())
  useEffect(() => {
    setQuery(api.getQuery())
  }, [api.searchState])

  return [query, setQuery]
}

export const SearchBar = ({ loading }) => {
  const [query, setQuery] = useQuery()
  const api = useSearchkit()

  return (
    <EuiFieldSearch
      placeholder="Search"
      value={query}
      onChange={(e) => {
        const value = e.target.value
        setQuery(value)
      }}
      isLoading={loading}
      onSearch={(value) => {
        setQuery(value)
        api.setQuery(value)
        api.search()
      }}
      isClearable
      aria-label="Search"
    />
  )
}
