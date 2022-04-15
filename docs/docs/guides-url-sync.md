---
id: guides-url-sync
title: URL Synchronization
sidebar_label: URL Synchronization
slug: /core/guides/url-synchronization
---

For features like SSR and sharing the search via url, we need to save the search state (what has been selected) via the url. To do this, we add the `withSearchkitRouting` HOC to the page. This needs to be after adding `withSearchkit` HOC.

`withSearchkitRouting` will watch for changes within the searchkit client and sync the state to the url. It will also listen for changes to the location state and update searchkit client based on the previous url.

This will enable you to be able to provide query params in the url for searchkit to update state, for example `/?query=heat` will show results with the query for "heat".

To get started, import the `withSearchkitRouting` HOC from `@searchkit/client` package.

```javascript
import {withSearchkit, withSearchkitRouting} from '@searchkit/client';
import dynamic from 'next/dynamic';
import withApollo from '../hocs/withApollo';

const Search = dynamic(() => import('../components/index'), {ssr: false});

export default withApollo(withSearchkit(withSearchkitRouting(Search)));
```

### How do I customise the url?

Out the box, searchkit provides default url serialisation functions. You may want to make the url more "pretty", depending on your application. To do so, you need to provide two functions to the HOC, `stateToRoute` and `routeToState`

```javascript
export default withApollo(
  withSearchkit(
    withSearchkitRouting(Search, {
      stateToRoute: myCustomStateToRouteFn,
      routeToState: myCustomRouteToStateFn,
    }),
  ),
);
```

`myCustomStateToRouteFn` will get the searchState from searchkitClient and you need to return an object for querystring to serialise to. An example of one below

```javascript
const myCustomStateToRouteFn = (searchState) => {
  const routeState = {
    query: searchState.query,
    sort: searchState.sortBy,
    filters: searchState.filters,
    size: Number(searchState.page?.size),
    from: Number(searchState.page?.from),
  };
  return Object.keys(routeState).reduce((sum, key) => {
    if (
      (isArray(routeState[key]) && routeState[key].length > 0) ||
      (!isArray(routeState[key]) && !!routeState[key])
    ) {
      sum[key] = routeState[key];
    }
    return sum;
  }, {});
};
```

`myCustomRouteToStateFn` will get the routeState from the url (objectified via QS) and you need to return a searchState object. An example of one below

```javascript
export const routeToStateFn = (routeState) => ({
  query: routeState.query || '',
  sortBy: routeState.sort,
  filters: routeState.filters || [],
  page: {
    size: Number(routeState.size) || 10,
    from: Number(routeState.from) || 0,
  },
});
```

For SEO, you may also want to adjust the url path too, based on what state has been selected. You can do this by overriding the `createURL` and `parseURL` functions. See [demo site](http://demo.searchkit.co/type/all?size=10) for example of this working and below is the code for this change.

```javascript
export default withApollo(
  withSearchkit(
    withSearchkitRouting(Search, {
      createURL: ({qsModule, location, routeState}) => {
        let filters;
        let typeCategoryURL = 'all';
        if (routeState.filters) {
          filters = routeState.filters.reduce(
            (sum, filter) => {
              if (filter.identifier === 'type') {
                sum.type.push(filter);
              } else {
                sum.all.push(filter);
              }
              return sum;
            },
            {
              type: [],
              all: [],
            },
          );
          if (filters.type.length > 0) {
            typeCategoryURL = filters.type
              .map((filter) => filter.value)
              .join('_');
          }
        }

        let newRouteState = {
          ...routeState,
          ...(filters ? {filters: filters.all} : {}),
        };

        const queryString = qsModule.stringify(newRouteState, {
          addQueryPrefix: true,
          arrayFormat: 'repeat',
        });

        return `/type/${typeCategoryURL}${queryString}`;
      },
      parseURL: ({qsModule, location}) => {
        const matches = location.pathname.match(/type\/(\w+)/);
        const routeState = qsModule.parse(location.search.slice(1), {
          arrayLimit: 99,
        });

        if (matches && matches[1] && matches[1] !== 'all') {
          const typeFilters = matches[1]
            .split('_')
            .map((value) => ({identifier: 'type', value}));
          if (!routeState.filters) routeState.filters = [];
          routeState.filters = [...routeState.filters, ...typeFilters];
        }
        return routeState;
      },
    }),
  ),
);
```

### When I update the query via the url, the search bar doesn't change

You will need to use the `useSearchkitQueryValue` hook to maintain the searchbar input value. The hook will listen to changes to the searchkit state and update.

```javascript
import {useSearchkit, useSearchkitQueryValue} from '@searchkit/client';
import {EuiFieldSearch} from '@elastic/eui';
import React from 'react';

export const SearchBar = ({loading}) => {
  const [query, setQuery] = useSearchkitQueryValue();
  const api = useSearchkit();

  return (
    <EuiFieldSearch
      placeholder="Search"
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
      }}
      isLoading={loading}
      onSearch={(value) => {
        setQuery(value);
        api.setQuery(value);
        api.search();
      }}
      isClearable
      aria-label="Search"
    />
  );
};
```

### What if I dont use NextJS?

For the first version, ive built it for NextJS but should be relatively easy to be used within express for example. If thats something you would like, open an issue.
