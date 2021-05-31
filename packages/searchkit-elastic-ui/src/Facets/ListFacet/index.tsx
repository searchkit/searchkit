import React from 'react'
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui'
import { useSearchkit, FilterLink } from '@searchkit/client'

export const ListFacet = ({ facet, loading }) => {
  const api = useSearchkit()

  const entries = facet.entries.map((entry) => (
    <EuiFacetButton
      style={{ height: '28px', marginTop: 0, marginBottom: 0 }}
      key={entry.id}
      quantity={entry.count}
      isSelected={api.isFilterSelected({ identifier: facet.identifier, value: entry.label })}
      isLoading={loading}
    >
      <FilterLink filter={{ identifier: facet.identifier, value: entry.label }}>
        {entry.label}
      </FilterLink>
    </EuiFacetButton>
  ))

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiFacetGroup>{entries}</EuiFacetGroup>
    </>
  )
}

ListFacet.DISPLAY = 'ListFacet'
