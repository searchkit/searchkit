import React from 'react'
import withApollo from 'next-with-apollo'
import { InMemoryCache, ApolloProvider, ApolloClient, createHttpLink } from '@apollo/client'

export default withApollo(
  ({ initialState, headers }) => {
    const cache = new InMemoryCache({}).restore(initialState || {})

    if (typeof window !== 'undefined') window.cache = cache

    return new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: '/api/graphql',
       // uri: 'http://localhost:3000/api/graphql',
        credentials: 'same-origin',
        headers: {
          cookie: headers?.cookie
        }
      }),
      cache
    })
  },
  {
    render: ({ Page, props }) => (
      <ApolloProvider client={props.apollo}>
        <Page {...props} />
      </ApolloProvider>
    )
  }
)
