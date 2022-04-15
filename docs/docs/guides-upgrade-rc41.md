---
id: guides-upgrade-rc41
title: RC41 Update - Remove id field from facet entries
sidebar_label: RC41 Update
slug: /core/guides/update-notes-rc41
---

Removal of ID from facets entries GQL type

1. Navigate to your client code where the GQL query is made
2. Locate the GQL query, should be something similar to below

```javascript
const query = gql`
  query resultSet(
    $query: String
    $filters: [SKFiltersSet]
    $page: SKPageInput
    $sortBy: String
  ) {
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
        sortOptions {
          id
          label
        }
        query
      }
      hits(page: $page, sortBy: $sortBy) {
        page {
          total
          totalPages
          pageNumber
          from
          size
        }
        sortedBy
        items {
          ... on ResultHit {
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
`;
```

3. locate the facets entries GQL query in the query

```graphql
facets {
  identifier
  type
  label
  display
  entries { // facet entries query
    id
    label
    count
  }
}
```

4. remove the `id` field in entries object. Reason for removal was Apollo cache was using this id and denormalising the cache, keeping a cache record for each facet entry.

The issue arises when the cache is reused for a different search state. For example, going from no query string to a query string will bring back different facet entries. When the user goes back to no query string, Apollo cache will reuse the facet entry for the one with a query string, potentially showing incorrect count.

5. Your GQL query should look similar to this

```graphql
facets {
  identifier
  type
  label
  display
  entries {
    label
    count
  }
}
```
