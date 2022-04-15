---
id: gql-guides-graphql-cheat-sheet
title: GQL Schema Queries Cheatsheet
sidebar_label: GQL Queries Cheatsheet
slug: /graphql/guides/graphql-schema-queries-cheatsheet
---

Try these examples on the [Demo GraphQL Playground](https://demo.searchkit.co/api/graphql)

### Simple Hits

```graphql
query {
  results {
    hits {
      items {
        ... on ResultHit {
          id
          fields {
            ## Add your fields via HitFields type
            title
          }
        }
      }
    }
  }
}
```

### Hit Querying

```graphql
query {
  results(query: "heat") {
    hits {
      items {
        ... on ResultHit {
          id
          fields {
            title
          }
        }
      }
    }
  }
}
```

### Hit Filtering

```graphql
query {
  results(
    filters: [
      {identifier: "type", value: "Movie"}
      {identifier: "rangeExample", min: 0, max: 100}
      {
        identifier: "dateExample"
        dateMin: "2020-12-01T00:00:00.000Z"
        dateMax: "2020-12-11T00:00:00.000Z"
      }
    ]
  ) {
    hits {
      items {
        id
      }
    }
  }
}
```

## Facets

Facets are configured together on the Searchkit Config within the facets array. Each facet can support a range of experiences from a simple list to date filtering

When configured, a GraphQL query using the facets node like below will bring back all the facet options for the result set. To apply a facet filter, you can specify the filter in the results arguments, shown below.

```gql
{
  results(filters: [{identifier: "type", value: "movie"}]) {
    facets {
      identifier
      label
      type
      display
      entries {
        label
        count
      }
    }
  }
}
```

The resolver also supports returning facet options for one particular facet via facet node.

```gql
{
  results(query: "heat") {
    facet(identifier: "type") {
      identifier
      label
      type ## facet class type
      display ## Used by client on how to display the facet. Can be configured in Facet configuration
      entries {
        label
        count
      }
    }
  }
}
```

### Single Facet

Used for facet interactions such as for search or for when displaying more facet options.

```graphql
query {
  results {
    facet(
      identifier: "actors"
      query: "a" ## query prefix to filter entries
      size: 20 ## size options on facet
    ) {
      identifier
      label
      type
      display
      entries {
        label
        count
      }
    }
  }
}
```

### Pagination

```graphql
query {
  results {
    hits(
      page: {from: 100, size: 100} ## used to control page
    ) {
      items {
        id
      }
      page {
        ## used for pagination display
        total
        totalPages
        pageNumber
        from
        size
      }
    }
  }
}
```

### Sorting Results

```graphql
query {
  results {
    summary {
      sortOptions {
        ## all available sort options
        id
        label
      }
    }
    hits(
      sortBy: "<id>" ## Wish to sort by, the sort id
    ) {
      sortedBy ## the selected sort, the sort id
    }
  }
}
```

Example of sorting

```gql
{
  results(query: "bla") {
    hits(sortBy: "relevance") {
      sortedBy
      items {
        ... on ResultHit {
          id
          fields {
            writers
            actors
          }
        }
      }
    }
  }
}
```

### Filter Summary

```graphql
query {
  results {
    summary {
      query ## the query value
      appliedFilters {
        ## array of filters applied to search
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
    }
    hits(page: {from: 100, size: 0}) {
      items {
        id
      }
    }
  }
}
```

#### Selected Date Filter Example

```graphql
{
  results(
    filters: [
      {identifier: "released", dateMin: "10/12/2020", dateMax: "10/12/2021"}
    ]
  ) {
    hits {
      items {
        id
      }
    }
  }
}
```

#### Selected Numeric Range Filter Example

```graphql
{
  results(filters: [{identifier: "metascore", min: 0, max: 100}]) {
    hits {
      items {
        id
      }
    }
  }
}
```

#### RefinementSelectFacet Filter & Display Example

```graphql
{
  results(filters: [{identifier: "type", value: "movie"}]) {
    summary {
      appliedFilters {
        identifier
        id
        label
        display
        ... on ValueSelectedFilter {
          value
        }
      }
    }
    hits {
      items {
        id
      }
    }
  }
}
```

### Query Options Usage

```graphql
{
  results(query: "heat", queryOptions: {fields: ["title^2", "description^1"]}) {
    hits {
      items {
        id
      }
    }
  }
}
```

## Geo location filtering

Able to filter the results by a geo location with `GeoLocationFilter`

```graphql
{
  result(
    filters: [
      {
        identifier: "location"
        geoBoundingBox: {
          topLeft: {lat: 70.73, lon: -95.1}
          bottomRight: {lat: 10.01, lon: -65.12}
        }
      }
    ]
  ) {
    hits {
      items {
        id
        ... on ParkResultHit {
          fields {
            title
            location
          }
        }
      }
    }
  }
}
```

### HierarchicalMenuFacet GraphQL query

```graphql
  results(query: "test", filters: [
    { identifier: 'categories', value: "Clothing" }
  ]) {
    summary {
      total
      appliedFilters {
        id
        identifier
        label
        display
        ... on ValueSelectedFilter {
          value
        }
      }
    }
    facets {
      identifier
      label
      facets {
        identifier
        type
        label
        display
        entries {
          label
          count
          entries {
            label
            count
            entries {
              label
              count
            }
          }
        }
      }
    }
  }
}
```
