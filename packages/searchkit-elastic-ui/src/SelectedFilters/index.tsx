import { useSearchkit } from '@searchkit/client'
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import React from 'react'

const ValueFilter = ({ filter, loading }) => {
  const api = useSearchkit()

  return (
    <EuiFlexItem grow={false}>
      <EuiButton
        onClick={() => {
          api.removeFilter(filter)
          api.search()
        }}
        iconSide="right"
        iconType="cross"
        isLoading={loading}
      >
        {filter.label}: {filter.value}
      </EuiButton>
    </EuiFlexItem>
  )
}

const NumericRangeFilter = ({ filter, loading }) => {
  const api = useSearchkit()

  return (
    <EuiFlexItem grow={false}>
      <EuiButton
        onClick={() => {
          api.removeFilter(filter)
          api.search()
        }}
        iconSide="right"
        iconType="cross"
        isLoading={loading}
      >
        {filter.label}: {filter.min} - {filter.max}
      </EuiButton>
    </EuiFlexItem>
  )
}

const DateRangeFilter = ({ filter, loading }) => {
  const api = useSearchkit()

  return (
    <EuiFlexItem grow={false}>
      <EuiButton
        onClick={() => {
          api.removeFilter(filter)
          api.search()
        }}
        iconSide="right"
        iconType="cross"
        isLoading={loading}
      >
        {filter.label}: {new Date(filter.dateMin).toDateString()} -{' '}
        {new Date(filter.dateMax).toDateString()}
      </EuiButton>
    </EuiFlexItem>
  )
}

export const SelectedFilters = ({ loading, data, customFilterComponents = {} }) => {
  const filterComponentMap = {
    ListFacet: ValueFilter,
    RangeSliderFacet: NumericRangeFilter,
    DateRangeFacet: DateRangeFilter,
    ComboBoxFacet: ValueFilter,
    ...customFilterComponents
  }
  return (
    <EuiFlexGroup gutterSize="s" alignItems="center">
      {data?.summary?.appliedFilters.map((filter) => {
        const FilterComponent = filterComponentMap[filter.display] || ValueFilter
        if (!filterComponentMap[filter.display])
          throw new Error(
            `could not display selected filters for ${filter.identifier} facet. Use customFilterComponents prop to pass a component to handle this filter for ${filter.display} display`
          )
        return <FilterComponent filter={filter} loading={loading} key={filter.id} />
      })}
    </EuiFlexGroup>
  )
}
