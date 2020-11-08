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

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const options = data?.results?.facet.entries.map((entry) => ({ label: entry.label }))

  const selectedOptions =
    api.getFiltersById(facet.id)?.map((filter) => ({
      label: filter.value
    })) || []

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
    setData(result.data)
    setLoading(false)
  }

  useEffect(() => {
    onSearchChange('')
  }, [])

  return (
    <EuiComboBox
      placeholder={`Search ${facet.label}`}
      async
      options={options}
      selectedOptions={selectedOptions}
      onSearchChange={onSearchChange}
      isLoading={loading}
      onChange={(filters) => {
        api.removeFiltersById(facet.id)
        filters.forEach((f) => {
          api.addFilter({ id: facet.id, value: f.label })
        })
        api.search()
      }}
    />
  )
}

ComboBoxFacet.DISPLAY = 'ComboBoxFacet'
