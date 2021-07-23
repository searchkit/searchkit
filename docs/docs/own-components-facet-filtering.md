---
id: own-components-ui-facet-value-filtering
title: Facet Options filtering
sidebar_label: Facet Options filtering
slug: /build-your-own-components/facet-value-filtering
---

### Filtering values on Facets
```graphql
  {
    results(filters: []) {
      facet(identifier: 'type', query: 'movi') {
        identifier
        label
        entries {
          label
          count
        }
      }
    }
  }
`
```

Gives you the ability to filter for values under the facet. This could power UI where you have a large list of facet options and you want the customer to filter and select the an option easily.

### Code Example on React Component
key points
- Need to get the applied query and filters from searchkit and apply them to the facet value search query

```jsx
export const ComboBoxFacet = ({ facet }) => {
  const api = useSearchkit()
  const client = useApolloClient()

  const [data, setData] = useState(() => facet.entries.map((entry) => ({ label: entry.label })))
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(() =>
    api.getFiltersByIdentifier(facet.identifier).map((filter) => ({ label: filter.value }))
  )

  const onSearchChange = async (searchValue) => {
    setLoading(true)
    const result = await client.query({
      query: facetRefinementSearchQuery,
      variables: {
        facetId: facet.identifier,
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
    const apiFilters = api.getFiltersByIdentifier(facet.identifier)
    if (apiFilters.length != filters.length) {
      api.removeFiltersByIdentifier(facet.identifier)
      filters.forEach((f) => {
        api.addFilter({ identifier: facet.identifier, value: f.label })
      })
      api.search()
    }
  }, [filters])

  return (
    <div>
      <input onChange={(e) => {
        const query = e.target.value
        onSearchChange(query)
      }}>
      <ul>
        {data.map((item) => {
          return (
            <li>{item.label}</li>
          )
        })}
    </div>
  )
}

```
