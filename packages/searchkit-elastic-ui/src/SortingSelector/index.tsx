import { useSearchkit } from '@searchkit/client'
import { EuiSuperSelect } from '@elastic/eui'
import React, { useState } from 'react'

export const SortingSelector = ({ data, loading }) => {
  const api = useSearchkit()

  const options = data.summmary?.sortOptions?.map((sortOption) => ({
    value: sortOption.id,
    inputDisplay: sortOption.label
  }))

  const selectedOptionId = data.results?.hits.sortedBy

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={selectedOptionId}
      onChange={(value) => {
        api.setSortBy(value)
        api.search()
      }}
    />
  )
}
