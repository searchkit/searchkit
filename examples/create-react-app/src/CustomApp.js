import {  gql } from '@apollo/client';
import { useSearchkitQuery, useSearchkit } from '@searchkit/client'

import React, { useState } from 'react'

const query = gql`
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          id
          identifier
          display
          label
          ... on DateRangeSelectedFilter {
            dateMin
            dateMax
          }

          ... on NumericRangeSelectedFilter {
            min
            max
          }

          ... on ValueSelectedFilter {
            value
          }
        }
        query
      }
      hits(page: $page) {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
        items {
          id
          fields {
            title
            writers
            actors
            plot
            poster
          }
        }
      }
      facets {
        identifier
        type
        label
        display
        entries {
          id
          label
          count
        }
      }
    }
  }
`

const SearchInput = () => {
  const api = useSearchkit()
  const [value, setValue] = useState('')
  return (
    <form onSubmit={() => {
      api.setQuery(value)
      api.search()
    }}>
      <input onChange={(e) => setValue(e.target.value)} />
    </form>
  )
}

const Facet = ({facet}) =>{
  const api = useSearchkit()

  return (
    <div>
      <h3>{facet.label}</h3>
    <ul>
      {facet.entries.map((entry) => (
        <li onClick={() => {
          api.toggleFilter({ identifier: facet.id, value: entry.label })
          api.search()
        }}>{entry.label} - {entry.count}</li>
      ))}
    </ul>
    </div>
  )
}

export default () => {
  const { data, loading } = useSearchkitQuery(query)
  if (loading) return null
  return (
    <div>
      <SearchInput />
      {data.results.facets.map((facet) => (
        <Facet facet={facet} />
      ))}
      <ul>
        {data.results.hits.items.map((hit) => {
          return (
            <li>{hit.id}</li>
          )
        })}
      </ul>
    </div>
  )
}
