---
id: gql-ui-setup
title: Initial Setup
sidebar_label: Initial Setup
slug: /graphql/quick-start/ui/setup
keywords:
  [React, Elasticsearch, Apollo Client, GraphQL, GraphQL React Elasticsearch]
description: Setting up Apollo client to call Searchkit GraphQL API and integrating with your own components
---

This section we will be setting up the UI part of searchkit.

Also see [Create React App](https://codesandbox.io/s/searchkit-create-react-app-xj25o0) if you're not using NextJS.

## Setup Apollo Client

First we need to setup Apollo client. In this guide we will be using [nextjs](https://nextjs.org/) & [withApollo HOC](https://github.com/lfades/next-with-apollo)

We add the @apollo/client, next-with-apollo, and graphql dependencies via yarn

`yarn add next-with-apollo @apollo/client graphql`

Then we configure apollo with next.

```javascript
// lib/withApollo.js
import withApollo from 'next-with-apollo';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

export default withApollo(
  ({initialState}) => {
    return new ApolloClient({
      uri: 'http://localhost:3000/api/graphql',
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    render: ({Page, props}) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  },
);
```

```javascript
// pages/index.js

import {gql, useQuery} from '@apollo/client';
import withApollo from '../lib/withApollo';

const QUERY = gql`
  query resultSet {
    results {
      hits {
        items {
          id
        }
      }
    }
  }
`;

const Index = () => {
  const {loading, previousData, data = previousData} = useQuery(QUERY);

  if (loading || !data) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      {data.results.hits.items.map((item) => {
        return <div key={item.id}>hit id: {item.id}</div>;
      })}
    </>
  );
};

export default withApollo(Index);
```

Now when you visit the [root page](http://localhost:3000), should perform a basic GQL query to the searchkit API for a list of hit ids. If it works, you should see a list of ids rendered. If it doesn't work, check the host is correct in the apollo configuration and make sure you can perform the same query on the [graphql playground](http://localhost:3000/api/graphql).

### Setup a basic Searchkit UI

Next we need to add the searchkit client API to the client. Searchkit client API simplifies managing the query and filter state on the client.

Searchkit provides a `withSearchkit` HOC that simplifies adding the provider and instantiating a new SearchkitClient.

First install the searchkit/client dependency via yarn

`yarn add @searchkit/client`

then update the root page to use the searchkit HOC

```javascript
// pages/index.js

import {gql, useQuery} from '@apollo/client';
import {useSearchkitVariables, withSearchkit} from '@searchkit/client';
import withApollo from '../lib/withApollo';

const QUERY = gql`
  query resultSet(
    $query: String
    $filters: [SKFiltersSet]
    $page: SKPageInput
  ) {
    results(query: $query, filters: $filters, page: $page) {
      hits {
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
  } = useQuery(QUERY, {
    variables,
  });

  if (loading || !data) {
    return <h1>loading...</h1>;
  }
  return (
    <>
      {data.results.hits.items.map((item) => {
        return <div key={item.id}>hit id: {item.id}</div>;
      })}
    </>
  );
};

export default withApollo(withSearchkit(Index));
```

Next you have a choice of two paths:

- Use the out the box Search Components with @searchkit/elastic-ui.
- Build your own components
