---
id: guides-graphql-schema-cheat-sheet
title: GQL Schema Queries Cheatsheet 
sidebar_label: GQL Queries Cheatsheet
slug: /guides/graphql-schema-queries-cheatsheet
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
          fields { <--- Add your fields via HitFields type
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
		  {identifier: "type", value: "Movie"},
		  {identifier: "rangeExample", min: 0, max: 100 },
		  {identifier: "dateExample", dateMin: "2020-12-01T00:00:00.000Z", dateMax: "2020-12-11T00:00:00.000Z" }
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

### Facet list
```graphql
query {
  results {
    facets { <-- array of all facets configured
      identifier 
      label
      display <-- Used by client on how to display the facet. Can be configured in Facet configuration
      type <-- facet class type
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
				identifier: "actors",
				query: "a", <-- query prefix to filter entries
				size: 20 <--- size options on facet
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
      page: {from: 100, size: 100 } <-- used to control page
    ) {
      items {
        id
      }
      page { <-- used for pagination display
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
      sortOptions { <--- all available sort options
        id
        label
      }
    }
    hits(
			sortBy: "<id>" <--- Wish to sort by, the sort id
		) {
      sortedBy <--- the selected sort, the sort id 
    }
  }
}
```

### Filter Summary

```graphql
query {
  results {
    summary {
      query <-- the query value
      appliedFilters { <-- array of filters applied to search
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
    hits(page: {from: 100, size: 0 }) {
      items {
        id
      }
    }
  }
}
```

