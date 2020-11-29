import { useSearchkit } from '@searchkit/client'
import { EuiSuperSelect } from '@elastic/eui'
import React, { useState, useEffect } from 'react'

export const SortingSelector = ({ data, loading }) => {
  const api = useSearchkit()
  const [value, setValue] = useState(() => data?.hits.sortedBy)

  useEffect(() => {
    if (data?.hits.sortedBy) {
      const selectedOptionId = data?.hits.sortedBy
      setValue(selectedOptionId)
    }
  }, [data])

  useEffect(() => {
    api.setSortBy(value)
    api.search()
  }, [value])

  const options =
    data?.summary?.sortOptions?.map((sortOption) => ({
      value: sortOption.id,
      inputDisplay: sortOption.label
    })) || []

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={value}
      isLoading={loading}
      onChange={(value) => {
        setValue(value)
      }}
    />
  )
}
