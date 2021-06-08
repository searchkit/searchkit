import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client'
import { EuiFieldSearch } from '@elastic/eui'
import React from 'react'

export const SearchBar = ({ loading }) => {
  const [query, setQuery] = useSearchkitQueryValue()
  const api = useSearchkit()

  return (
    <EuiFieldSearch
      placeholder="Search"
      value={query}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
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
