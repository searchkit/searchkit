---
id: searchkit-client
title: Searchkit Client
sidebar_label: "@searchkit/client"
slug: /reference/searchkit-client
---

## Package Installation

```yarn add @searchkit/client```

## SearchkitClient

The SearchkitClient class encapsulates Searchkit's core client-side API. Maintains query and filter state and performs an apollo query  

### Usage

```javascript
import { SearchkitClient } from '@searchkit/client'

const client = new SearchkitClient({
  itemsPerPage: 12,
  searchOnLoad: true
})

```

### SearchkitClientConfig Field Options

| Option        |      Description      |
| :------------- | :----------- |
| itemsPerPage         | Optional. Default number of items per page. |
| searchOnLoad | A boolean to search on load, defaults to true |

### SearchkitClient Methods

#### search() : void
Will perform a request to API with the current query, page and filters currently in state

#### setQuery(query): void
To set the query. When called, will reset pagination and filters applied

| Option        |      Description      |
| :------------- | :----------- |
| query         | The query value |

#### getQuery(): string
Returns the current query that has been set

#### setPage(page: PageOption): void
Sets the current page

| Option        | Description      |
| :------------- | :----------- |
| page          | PageOptions is an object which has `size` and `from` properties. Size sets number of items and from is the item number to start from. |

#### getFilters(): Filter[]
Returns an array of filters currently in state

#### canResetSearch(): Boolean
Returns true when there has been a query or filter applied to the search

#### isFilterSelected(filter: Filter): Boolean
Returns true if the filter has been applied to the search.

#### getFiltersByIdentifier(identifier): Filter[] | null
Returns all filters that match id. If no filters have been found, will return null

#### removeFilter(filter: Filter): void
Removes filter from applied filters

#### removeFiltersByIdentifier(identifier): void
Removes all filters from applied filters that match id

#### addFilter(filter: Filter): void
Adds filter to applied filters

#### toggleFilter(filter: Filter): void
If the filter already exists in applied filters then it will remove the filter. If doesn't exist, will add the filter

#### setSortBy(id: string): void
Set sorting id. Sort field is returned in the query variables

## withSeachkit HOC
Wraps component with Searchkit Provider with an instantiated SearchkitClient. Useful for NextJS Pages. 

### Usage

```javascript
import { withSearchkit } from '@searchkit/client'

const Index = (props) => {
  return <Search />
}

export default withSearchkit(Index)

```

## Searchkit Provider
Provides to child components access to the shared SearchkitClient instance

### Usage

```javascript
  import { SearchkitClient, SearchkitProvider } from '@searchkit/client'

  const client = new SearchkitClient()

  export default () => (
    <SearchkitProvider client={client}>
      <SearchComponents />
    </SearchkitProvider>
  )

```

### Options
*client*: Required. Instance of SearchkitClient to be used by child components which need SearchkitClient API

## useSearchkit hook
Returns the shared SearchkitClient instance. Required to update the shared query / filter state and for components to invoke a new query.

### Usage

```javascript
import React, { useState } from 'react'
import { useSearchkit } from '@searchkit/client'

const SearchInput = () => {
  const api = useSearchkit()
  const [value, setValue] = useState('')
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      api.setQuery(value)
      api.search()
    }} >
      <input type="text" value={value} onChange={(e) => {
        const inputValue = e.target.value
        setValue(inputValue)
      }}>
  </form>
}
```

## useSearchkitQuery(query)
Query contains all data requirements needed to power the search.

### Usage

```javascript
import { useSearchkitQuery } from '@searchkit/client'

const query = gql`
  query resultSet($query: String, $filters: [FiltersSet], $page: PageInput, $sortBy: String) {
    results(query: $query, filters: $filters) {
      hits(page: $page) {
        items {
          id
        }
      }
    }
  }
`

const Index = () => {
  const { data, loading } = useSearchkitQuery(query)
  return (
    <div>search</div>
  )

}
```

### Options
| Option        | Description      |
| :------------- | :----------- |
| query          | GQL query that has query, filters, sorting & page variables |
