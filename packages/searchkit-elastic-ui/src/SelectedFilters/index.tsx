import { FilterLink, useSearchkit, FilterLinkClickRef } from '@searchkit/client'
import { EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'
import React, { useRef } from 'react'

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

const ValueFilter = ({ filter, loading }) => {
  const ref = useRef<FilterLinkClickRef>()

  return (
    <EuiFlexItem grow={false}>
      <EuiButton
        iconSide="right"
        iconType="cross"
        isLoading={loading}
        onClick={(e) => {
          ref.current.onClick(e)
        }}
      >
        <FilterLink ref={ref} filter={filter}>
          <>
            {filter.label}: {filter.value}
          </>
        </FilterLink>
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
    HierarchicalMenuFacet: ValueFilter,
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
