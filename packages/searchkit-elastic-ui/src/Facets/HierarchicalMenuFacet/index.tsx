import React, { Fragment, useRef } from 'react'
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui'
import { useSearchkit, FilterLink, FilterLinkClickRef } from '@searchkit/client'

const EntriesList = ({ entries, loading, facet }) => {
  const api = useSearchkit()
  const entriesElements = entries.map((entry) => {
    const ref = useRef<FilterLinkClickRef>()
    return (
      <Fragment key={entry.label}>
        <EuiFacetButton
          style={{ height: '28px', marginTop: 0, marginBottom: 0 }}
          quantity={entry.count}
          isSelected={api.isFilterSelected({
            identifier: facet.identifier,
            value: entry.label,
            level: entry.level
          })}
          isLoading={loading}
          onClick={(e) => {
            ref.current.onClick(e)
          }}
        >
          <FilterLink
            ref={ref}
            filter={{ identifier: facet.identifier, value: entry.label, level: entry.level }}
          >
            {entry.label}
          </FilterLink>
        </EuiFacetButton>
        <div style={{ marginLeft: '10px' }}>
          {entry.entries && <EntriesList entries={entry.entries} loading={loading} facet={facet} />}
        </div>
      </Fragment>
    )
  })
  return <EuiFacetGroup>{entriesElements}</EuiFacetGroup>
}

export const HierarchicalMenuFacet = ({ facet, loading }) => (
  <>
    <EuiTitle size="xxs">
      <h3>{facet.label}</h3>
    </EuiTitle>
    <EntriesList entries={facet.entries} facet={facet} loading={loading} />
  </>
)

HierarchicalMenuFacet.DISPLAY = 'HierarchicalMenuFacet'
