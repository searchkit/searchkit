---
id: guides-url-sync
title: Url Synchronization
sidebar_label: Url Synchronization
slug: /guides/url-synchronization
---

For features like SSR and sharing the search via url, we need to save the search state (what has been selected) via the url. To do this, we add the `withSearchkitRouting` HOC to the page. This needs to be after adding `withSearchkit` HOC.

`withSearchkitRouting` will watch for changes within the searchkit client and sync the state to the url. It will also listen for changes to the location state and update searchkit client based on the previous url.

This will enable you to be able to provide query params in the url for searchkit to update state, for example 
`/?query=heat` will show results with the query for "heat".

To get started, import the `withSearchkitRouting` HOC from `@searchkit/client` package.

```
import { withSearchkit, withSearchkitRouting } from '@searchkit/client'
import dynamic from 'next/dynamic'
import withApollo from '../hocs/withApollo'

const Search = dynamic(() => import('../components/index'), { ssr: false })

export default withApollo(withSearchkit(withSearchkitRouting(Search)))

```

### How do I customise the url?

Out the box, searchkit provides default url serialisation functions. You may want to make the url more "pretty", depending on your application. To do so, you need to provide two functions to the HOC, `stateToRoute` and `routeToState`

```
export default withApollo(withSearchkit(withSearchkitRouting(Search, {
  stateToRoute: myCustomStateToRouteFn,
  routeToState: myCustomRouteToStateFn
})))
```

`myCustomStateToRouteFn` will get the searchState from searchkitClient and you need to return an object for querystring to serialise to. An example of one below

```
const myCustomStateToRouteFn = (searchState) => {
  const routeState = {
    query: searchState.query,
    sort: searchState.sortBy,
    filters: searchState.filters,
    size: Number(searchState.page?.size),
    from: Number(searchState.page?.from)
  }
  return Object.keys(routeState).reduce((sum, key) => {
    if (
      (isArray(routeState[key]) && routeState[key].length > 0) ||
      (!isArray(routeState[key]) && !!routeState[key])
    ) {
      sum[key] = routeState[key]
    }
    return sum
  }, {})
}

```

`myCustomRouteToStateFn` will get the routeState from the url (objectified via QS) and you need to return a searchState object. An example of one below

```
export const routeToStateFn = (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort,
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || 10,
    from: Number(routeState.from) || 0
  }
})

```

### When I update the query via the url, the search bar doesn't change

You will need to use the `useSearchkitQueryValue` hook to maintain the searchbar input value. The hook will listen to changes to the searchkit state and update.

```
import { useSearchkit, useSearchkitQueryValue } from '@searchkit/client'
import { EuiFieldSearch } from '@elastic/eui'
import React from 'react'

export const SearchBar = ({ loading }) => {
  const [query, setQuery] = useSearchkitQueryValue()
  const api = useSearchkit()

  return (
    <EuiFieldSearch
      placeholder="Search"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
      }}
      isLoading={loading}
      onSearch={(value) => {
        setQuery(value)
        api.setQuery(value)
        api.search()
      }}
      isClearable
      aria-label="Search"
    />
  )
}
```

### What if I dont use NextJS?

For the first version, ive built it for NextJS but should be relatively easy to be used within express for example. If thats something you would like, open an issue.