import React from 'react'
import withApollo from 'next-with-apollo'
import { InMemoryCache, ApolloProvider, ApolloClient } from '@apollo/client'

export default withApollo(
  ({ initialState }) => {
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
      uri: `/api/graphql`,
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
