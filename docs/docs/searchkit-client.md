---
id: searchkit-client
title: Searchkit Client
sidebar_label: '@searchkit/client'
slug: /core/reference/searchkit-client
---

## Package Installation

`yarn add @searchkit/client`

## SearchkitClient

The SearchkitClient class encapsulates Searchkit's core client-side API. Maintains query and filter state and performs an apollo query

### Usage

```javascript
import {SearchkitClient} from '@searchkit/client';

const client = new SearchkitClient({
  itemsPerPage: 20,
});
```

| Option | Description |
| :-- | :-- |
| itemsPerPage | The initial items per page. url parameter will override value if specified |

### SearchkitClient Methods

#### search() : void

Will perform a request to API with the current query, page and filters currently in state

#### setQuery(query): void

To set the query. When called, will reset pagination and filters applied

| Option | Description     |
| :----- | :-------------- |
| query  | The query value |

#### getQuery(): string

Returns the current query that has been set

#### setPage(page: PageOption): void

Sets the current page

| Option | Description |
| :-- | :-- |
| page | PageOptions is an object which has `size` and `from` properties. Size sets number of items and from is the item number to start from. |

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
import {withSearchkit} from '@searchkit/client';

const Index = (props) => {
  return <Search />;
};

export default withSearchkit(Index);
```

## withSeachkitRouting HOC

Wraps component with Searchkit Routing functionality. Requires NextJS Page. See [url synchronization](www.searchkit.co/docs/guides/url-synchronization) for more information.

### Usage

```javascript
import {withSearchkit, withSearchkitRouting} from '@searchkit/client';

const Index = (props) => {
  return <Search />;
};

export default withSearchkit(withSearchkitRouting(Index));
```

## Searchkit Provider

Provides to child components access to the shared SearchkitClient instance

### Usage

```javascript
import {SearchkitClient, SearchkitProvider} from '@searchkit/client';

const client = new SearchkitClient();

export default () => (
  <SearchkitProvider client={client}>
    <SearchComponents />
  </SearchkitProvider>
);
```

### Options

_client_: Required. Instance of SearchkitClient to be used by child components which need SearchkitClient API

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

## useSearchkitVariables Hook

Hook that returns all searchkit variables needed to power the search. Use in conjuction with apollo client.

### Usage

```javascript
import {useQuery} from '@apollo/client';
import {useSearchkitVariables} from '@searchkit/client';

const query = gql`
  query resultSet(
    $query: String
    $filters: [SKFiltersSet]
    $page: SKPageInput
    $sortBy: String
  ) {
    results(query: $query, filters: $filters) {
      hits(page: $page) {
        items {
          id
        }
      }
    }
  }
`;

const Index = () => {
  const variables = useSearchkitVariables();
  const {
    previousData,
    data = previousData,
    loading,
  } = useQuery(query, {
    variables,
  });
  return <div>search</div>;
};
```

## useSearchkitQueryValue Hook

Hook thats similar to the react useState hook but listens on changes to SearchkitClient and updates the value should there be a change in value outside of the component (like url query change).

### Usage

```javascript
import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client'
import React from 'react'

export const SearchBar = () => {
  const [query, setQuery] = useSearchkitQueryValue()
  const api = useSearchkit()

  return (
    <form onSubmit={(e) => {
        e.preventDefault()
        api.setQuery(value)
        api.search()
    }}
      <input
        placeholder="Search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
      />
    </form>
  )
}

```

## FilterLink Component

A link component that handles the interaction for toggling a filter. If routing has been configured, (see [routing guide](https://searchkit.co/docs/guides/url-synchronization) for more information) href attribute would be provided for the next state.

### Usage

```javascript
import {useSearchkit, FilterLink} from '@searchkit/client';
import React from 'react';

export const ListFacet = ({facet, loading}) => {
  const api = useSearchkit();

  const entries = facet.entries.map((entry) => (
    <FilterLink
      key={entry.id}
      filter={{identifier: facet.identifier, value: entry.label}}>
      {entry.label} - ({entry.count})
    </FilterLink>
  ));

  return (
    <>
      <h3>{facet.label}</h3>
      <div>{entries}</div>
    </>
  );
};
```

### Options

| Option | Description |
| :-- | :-- |
| filter | Required. Filter object to be toggled. If filter is selected, the next action will be for it to be removed |
| resetPagination | Optional. Default is true. When true, when filter is applied, resets pagination to 0. |

## Pagination Component

A link component that handles the interaction for navigating to a particular page. If routing has been configured, (see [routing guide](https://searchkit.co/docs/guides/url-synchronization) for more information) href attribute would be provided for the next state.

### Usage

```javascript
import {useSearchkit, PaginationLink} from '@searchkit/client';
import React from 'react';

export const Pagination = ({data, loading}) => {
  const api = useSearchkit();

  const currentPage = data.hits.page.pageNumber;

  return (
    <>
      <PaginationLink page={currentPage - 1}>Previous</PaginationLink>
      <PaginationLink page={currentPage + 1}>Next</PaginationLink>
    </>
  );
};
```

### Options

| Option | Description             |
| :----- | :---------------------- |
| page   | Required. The next page |
