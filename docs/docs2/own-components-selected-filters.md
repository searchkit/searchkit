---
id: own-components-ui-selected-filters
title: Selected Filters
sidebar_label: Selected Filters
slug: /build-your-own-components/selected-filters
---

The component that will shows filters that been applied to the search results and ability to remove them.

### GraphQL Query
You can use GraphQL summary node to provide you what filters have been applied and the search query. list below is all possible values that summary node provides and with graphQL, you can specify what fields you need.

```graphql
  results(query: "test") {
    summary {
      total // total number of results
      appliedFilters { // returns an array of filters applied
        id
        identifier
        label
        display
        ... on ValueSelectedFilter {
          value
        }
        ... on NumericRangeSelectedFilter {
          min
          max
        }
        ... on DateRangeSelectedFilter {
          dateMin
          dateMax
        }
      }
      query // query text if one has been applied
      sortOptions { // all possible sort fields
        id
        label
      }
    }
  }
}
```

### React Component

[Searchkit SelectedFilters](https://github.com/searchkit/searchkit/blob/next/packages/searchkit-elastic-ui/src/SelectedFilters/index.tsx)

Key points:
- Use `FilterLink` React component. This will provide both href url (if routing has been switched on) / onClick handler to remove the filter. See [FilterLink API documentation](https://searchkit.co/docs/reference/searchkit-client#filterlink-component) for more information.
- You can determine how to "style" the component depending on the filter type (whether its a value, date range, numeric range or your own custom facet) by the `__typename` or by `display` field. Display field is driven by the facet config in your API.  See [writing your own facet component guide](https://searchkit.co/docs/build-your-own-components/custom-ui-facet)

#### Basic Example

```jsx
function SelectedFilters({ data, loading }) => {
  const { summary } = data.results
  return (
    <div className="results-selected-filters">
      <ul>
        {summary.query && <li className="filter" key={summary.query}>{summary.query}</li>
        {summary.appliedFilters.map((filter) => {
          return (
            <li className="filter" key={summary.id}>
              <FilterLink 
                filter={{identifier: filter.identifier, value: filter.value }}>
                  {filter.label}: {filter.value}
              </FilterLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```
