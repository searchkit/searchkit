import React, { useState, useEffect } from 'react'
import { EuiComboBox } from '@elastic/eui'
import { useSearchkit } from '@searchkit/client'
import { gql, useApolloClient } from '@apollo/client'

const facetRefinementSearchQuery = gql`
  query refinementFacet(
    $facetQuery: String
    $query: String
    $filters: [FiltersSet]
    $facetId: String!
  ) {
    results(query: $query, filters: $filters) {
      facet(id: $facetId, query: $facetQuery) {
        id
        label
        entries {
          id
          label
          count
        }
      }
    }
  }
`

export const ComboBoxFacet = ({ facet }) => {
  const api = useSearchkit()
  const client = useApolloClient()

  const [data, setData] = useState(() => facet.entries.map((entry) => ({ label: entry.label })))
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(() =>
    api.getFiltersById(facet.id).map((filter) => ({ label: filter.value }))
  )

  const onSearchChange = async (searchValue) => {
    setLoading(true)
    const result = await client.query({
      query: facetRefinementSearchQuery,
      variables: {
        facetId: facet.id,
        query: api.getQuery(),
        filters: api.getFilters(),
        facetQuery: searchValue
      }
    })
    const options = result.data.results.facet.entries.map((entry) => ({ label: entry.label }))
    setData(options)
    setLoading(false)
  }

  useEffect(() => {
    const apiFilters = api.getFiltersById(facet.id)
    if (apiFilters.length != filters.length) {
      api.removeFiltersById(facet.id)
      filters.forEach((f) => {
        api.addFilter({ id: facet.id, value: f.label })
      })
      api.search()
    }
  }, [filters])

  return (
    <EuiComboBox
      placeholder={`Search ${facet.label}`}
      async
      options={data}
      selectedOptions={filters}
      onSearchChange={onSearchChange}
      isLoading={loading}
      onChange={(filters) => {
        setFilters(filters)
      }}
    />
  )
}

ComboBoxFacet.DISPLAY = 'ComboBoxFacet'
