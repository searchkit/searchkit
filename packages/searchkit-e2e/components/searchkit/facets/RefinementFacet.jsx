import React from 'react'
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'

export const RefinementFacet = ({ facet, loading }) => {
  const api = useSearchkit()

  const entries = facet.entries.map((entry) => {
    return (
      <EuiFacetButton
        style={{ height: '28px' }}
        key={entry.id}
        quantity={entry.count}
        isSelected={api.isFilterSelected({ id: facet.id, value: entry.label })}
        onClick={() => {
          api.toggleFilter({ id: facet.id, value: entry.label })
          api.search()
        }}
        isLoading={loading}
      >
        {entry.label}
      </EuiFacetButton>
    )
  })

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiFacetGroup>{entries}</EuiFacetGroup>
    </>
  )
}

RefinementFacet.TYPE = 'RefinementSelectFacet'
