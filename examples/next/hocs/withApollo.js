import React from 'react'
import withApollo from 'next-with-apollo'
import { InMemoryCache, ApolloProvider, ApolloClient, createHttpLink } from '@apollo/client'

export default withApollo(
  ({ initialState, headers }) => {
    const cache = new InMemoryCache({
      typePolicies: {
        FacetSetEntry: {
          keyFields: false
        }
      }
      // possibleTypes: introspectionResult.possibleTypes
    }).restore(initialState || {})

    if (typeof window !== 'undefined') window.cache = cache

    return new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: '/api/graphql',
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
