---
id: own-components-ui-summary
title: Results Summary
sidebar_label: Results Summary
slug: /build-your-own-components/summary
---

The component that will summarise the results.

### GraphQL Query
With GraphQL, the list below is all possible values that summary provides but you can specify what fields you need.

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

Next you can build a UI component that uses this summary data to show:
- number of results returned in the search
- the search query
- the filters that have been applied

```jsx
function ResultsSummary({ data }) => {
  const { summary } = data.results
  return (
    <div className="results-summary">
      <h3>{summary.total} results from {summary.appliedFilters.length} Filters and searching for "{summary.query}"<h3>
    </div>
  )
}

```