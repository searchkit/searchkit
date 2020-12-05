---
id: searchkit-elastic-ui
title: Searchkit Elastic UI
sidebar_label: "@searchkit/elastic-ui"
slug: /reference/searchkit-elastic-ui
---

## Setup

Require to setup the provider, define a GQL query for components and use the searchkitQuery hook to perform the search. See Quick start UI Setup for more information.

```javascript

import { useSearchkitQuery, SearchkitProvider, SearchkitClient } from '@searchkit/client'
import { gql } from '@apollo/client'

const query = gql`
  query resultSet($query: String, $filters: [FiltersSet], $page: PageInput) {
    results(query: $query, filters: $filters) {
      summary {
        total
        appliedFilters {
          identifier
          label
          value
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

const client = SearchkitClient()

export default () => {

  const { data, loading } = useSearchkitQuery(query)

  return (
    <div>
      <SearchkitProvider client={client}>
        <SearchBar loading={loading} />
        <Hits data={data} />
      </SearchkitProvider>
    </div>
  )

}

```

## Components

### SearchBar

searchbar.mov

#### Usage

```javascipt
import {
  SearchBar
} from '@searchkit/elastic-ui'
```

```javascript
<SearchBar loading={loading} />
```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| loading          | Boolean   |


### SelectedFilters
SelectedFilters.mov

#### Usage

```javascipt
import {
  SelectedFilters
} from '@searchkit/elastic-ui'
```

```javascript
  <SelectedFilters data={data?.results} loading={loading} />
```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| loading          | Boolean. Loading value from GQL query   |
| data | Response from GQL query | 


### ResetSearchButton

ResetSearchButton.mov

#### Usage

```javascipt
import {
  ResetSearchButton
} from '@searchkit/elastic-ui'
```

```javascript
  <ResetSearchButton loading={loading} />
```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| loading          | Boolean. Loading value from GQL query   |


### Pagination
Pagination.mov

#### Usage

```javascipt
import {
  Pagination
} from '@searchkit/elastic-ui'
```

```javascript
  <Pagination data={data?.results} />
```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| data          | Boolean. Loading value from GQL query   |

### Sorting Selector
Pagination.mov

#### Usage
Requires sorting configuration within the resolvers. See [sorting documentation](/docs/reference/apollo-resolvers#sorting).

```javascipt
import {
  SortingSelector
} from '@searchkit/elastic-ui'
```

```javascript
  <SortingSelector data={data?.results} loading={loading} />
```

### GraphQL Query
Relies on GraphQL query

```
  results(query: "") {
    summary {
      total
      sortOptions {  <--- Required: sortOptions
        id
        label
      }
    }
    hits(sortBy: "relevance") {
      sortedBy  <--- Required: the current sortId
    }
  }

```

#### Options
| Option        | Description      |
| :------------- | :----------- |
| data          | data response from graphql request   |
| loading          | Boolean.   |

## Facets

### FacetsList
Searchkit API returns a list of facets, in the configuration order. Each facet is configured with a  display field and this field is tied with a component. 

ListFacet component will use the facet response and for each facet, will display the correct facet component to the user.

FacetsList is a function which returns a React component that accepts the data / loading props.You will be able to pass custom facet components within the optional argument. FacetsList Searchkit will render all Searchkit Facet Components.

#### Usage
```javascript
import {
  FacetsList
} from '@searchkit/elastic-ui'

export default () => {
  const Facets = FacetsList([CustomFacet])
  return (
    <div>
      <Facets data={data?.results} loading={loading} />
    </div>

  )
}
```

### ListFacet
ListFacet.mov

### RangeSliderFacet
RangeSliderFacet.mov

### ComboBoxFacet
ComboBoxFacet.mov

### DateRangeFacet
DateRangeFilter.mov
