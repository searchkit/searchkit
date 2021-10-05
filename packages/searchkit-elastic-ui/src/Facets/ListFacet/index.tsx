import React, { useRef, useState } from 'react'
import { EuiFacetGroup, EuiTitle, EuiFacetButton } from '@elastic/eui'
import { useSearchkit, FilterLink, FilterLinkClickRef } from '@searchkit/client'

export const ListFacet = ({ facet, loading }) => {
  /*FIXME Read from RefinementSelectFacet prop?"*/
  const elementsFromConfig = 4
  const difference = 2

  const [elements, setElements] = useState(elementsFromConfig)

  const api = useSearchkit()

  const entries = facet.entries.map((entry) => {
    const ref = useRef<FilterLinkClickRef>()

    return (
      <EuiFacetButton
        style={{ height: '28px', marginTop: 0, marginBottom: 0 }}
        key={entry.label}
        quantity={entry.count}
        isSelected={api.isFilterSelected({ identifier: facet.identifier, value: entry.label })}
        isLoading={loading}
        onClick={(e) => {
          ref.current.onClick(e)
        }}
      >
        <FilterLink ref={ref} filter={{ identifier: facet.identifier, value: entry.label }}>
          {entry.label}
        </FilterLink>
      </EuiFacetButton>
    )
  })

  /* Prepare conditions for more/less buttons"*/
  const loadedEntries = entries.length
  const showMore = elements < loadedEntries
  const showLess = elements <= loadedEntries && elements > difference
  entries.length = elements

  return (
    <>
      <EuiTitle size="xxs">
        <h3>{facet.label}</h3>
      </EuiTitle>
      <EuiFacetGroup>{entries}</EuiFacetGroup>
      {showMore && (
        <EuiFacetButton
          aria-label="show more"
          onClick={() => {
            setElements(elements + difference)
          }}
        >
          more
        </EuiFacetButton>
      )}
      {showLess && (
        <EuiFacetButton
          aria-label="show less"
          onClick={() => {
            setElements(elements - difference)
          }}
        >
          less
        </EuiFacetButton>
      )}
    </>
  )
}

ListFacet.DISPLAY = 'ListFacet'
