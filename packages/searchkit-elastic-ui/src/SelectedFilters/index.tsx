import { useSearchkit } from '@searchkit/client'
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import React from 'react'

export const SelectedFilters = ({ loading }) => {
  const api = useSearchkit()

  return (
    <EuiFlexGroup gutterSize="s" alignItems="center">
      {api.getFilters().map((filter) => (
        <EuiFlexItem grow={false} key={`${filter.identifier}_${filter.value}`}>
          <EuiButton
            onClick={() => {
              api.removeFilter(filter)
              api.search()
            }}
            iconSide="right"
            iconType="cross"
            isLoading={loading}
          >
            {filter.identifier}: {filter.value} {filter.min} {filter.max}
          </EuiButton>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  )
}
