import { useSearchkit } from '@searchkit/client'
import { EuiFieldSearch } from '@elastic/eui'
import React, { useState } from 'react'

export const SearchBar = ({ loading }) => {
  const api = useSearchkit()
  const [value, setValue] = useState(api.getQuery())

  return (
    <EuiFieldSearch
      placeholder="Search"
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      isLoading={loading}
      onSearch={() => {
        api.setQuery(value)
        api.search()
      }}
      isClearable
      aria-label="Search"
    />
  )
}
