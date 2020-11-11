---
id: base-ui-setup
title: Initial Setup
sidebar_label: Initial Setup
slug: /quick-start/ui/setup
---

This section we will be setting up the UI part of searchkit.

## Setup Apollo Client

First we need to setup Apollo client. In this guide we will be using [nextjs](https://nextjs.org/) & [withApollo HOC](https://github.com/lfades/next-with-apollo)

We add the @apollo/client & next-with-apollo dependencies via yarn

```yarn add next-with-apollo @apollo/client```

Then we configure apollo with next.

```javascript
// lib/withApollo.js
import withApollo from 'next-with-apollo';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
);

// pages/index.js

import { gql, useQuery } from '@apollo/client';
import withApollo from '../lib/withApollo';

const query = gql`
  query resultSet {
    results {
      hits {
        items {
          id
        }
      }
    }
  }
`

const Index = () => {
  const { loading, data } = useQuery(QUERY);

  if (loading || !data) {
    return <h1>loading...</h1>;
  }
  return <>
    {data.results.hits.items.map((item) => {
      return (
        <div>hit id: {item.id}</div>
      )
    })}
  </>;
};

export default withApollo(Index);
```

Now when you visit the [root page](http://localhost:3000), should perform a basic GQL query to the searchkit API for a list of hit ids. If it works, you should see a list of ids rendered. If it doesn't work, check the host is correct in the apollo configuration and make sure you can perform the same query on the [graphql playground](http://localhost:3000/api/graphql). 

### Setup a basic Searchkit UI

Next we need to add the searchkit client API to the client. Searchkit client API simplifies managing the query and filter state on the client.

Searchkit provides a `withSearchkit` HOC that simplifies adding the provider and instantiating a new SearchkitClient. 

First install the searchkit/client dependency via yarn

```yarn add @searchkit/client```

then update the root page to use the searchkit HOC

```javascript
// pages/index.js

import { gql } from '@apollo/client';
import { useSearchkitQuery, useSearchkit } from '@searchkit/client'
import withApollo from '../lib/withApollo';
import { useState } from 'react'

const QUERY = gql`
    query resultSet($query: String, $filters: [FiltersSet], $page: PageInput) {
      results(query: $query, filters: $filters) {
        hits() {
          items {
            id
          }
        }
      }
    }
  `

const Index = () => {
  const { data, loading } = useSearchkitQuery(QUERY)

  if (loading || !data) {
    return <h1>loading...</h1>;
  }
  return <>
    {data.results.hits.items.map((item) => {
      return (
        <div>hit id: {item.id}</div>
      )
    })}
  </>;
};

export default withApollo(useSearchkit(Index));
```

Next you have a choice of two paths:
- Use the out the box Search Components with @searchkit/elastic-ui. [Read more](/docs/quick-start/ui/eui)
- Build your own components [Read more](/docs/quick-start/ui/your-components)

