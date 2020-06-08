import React from 'react'
import { MultiSelectFacet } from './MultiSelectFacet'
import { RefinementFacet } from './RefinementFacet'
import { EuiSpacer } from '@elastic/eui'

export const FacetsContainer = (components = []) => {
  const componentTypeMap = [...components, RefinementFacet, MultiSelectFacet].reduce(
    (sum, component) => {
      sum[component.TYPE] = component
      return sum
    },
    {}
  )
  return ({ data, loading }) => (
    <>
      {data?.facets.map((facet) => {
        const Component = componentTypeMap[facet.type]
        return (
          <div key={facet.id}>
            <Component facet={facet} loading={loading} />
            <EuiSpacer size="l" />
          </div>
        )
      })}
    </>
  )
}
