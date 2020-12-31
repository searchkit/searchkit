---
id: guides-upgrade-rc25
title: RC25 Update Notes
sidebar_label: RC25 Update
slug: /guides/update-notes-rc25
---

Majority of changes are from:
1. changing the dependencies
2. API for graphql side has changed
3. The Searchkit types have now changed to minimise conflicting with your own types

## Steps

First update the dependencies from `@searchkit/apollo-resolvers` to `@searchkit/schema`

package.json

before:
```
 "@searchkit/apollo-resolvers": "^3.0.0-canary.24",
```

now:
```
    "@searchkit/schema": "^3.0.0-canary.25",
```

then update the imports within the api file

graphql.js

```
const {
  MultiMatchQuery,
  SearchkitSchema,
  RefinementSelectFacet
} = require('@searchkit/schema')
```

SearchkitSchema now returns the necessary typeDefs, resolvers and context required by searchkit. Call SearchkitSchema method, passing in the config and typeName.

```es6

// calling searchkitSchema with config and returns the SDL typeDefs + resolvers HOC fn + context

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'Result', // base typename.
  addToQueryType: true // When true, adds a field called results to Query type
})

// Then configure the graphql server (below uses apollo server but similar for others) passing in the typeDefs, resolvers and context
const combinedTypeDefs = [
  gql`
    type Query {
      root: String
    }

    type HitFields {
      title: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }
  `,
  typeDefs
]

const server = new ApolloServer({
  typeDefs: combinedTypeDefs,
  resolvers: withSearchkitResolvers({
    // own resolvers here. withSearchkitResolvers will merge searchkit's and your own resolvers
  }),
  playground: true,
  introspection: true,
  context: {
    // searchkit context
    ...context
  }
});
```

Then on the frontend, update the graphql query with the following changes:

1. Update the types on the query variables. Right on the top of the GQL query
before:
```gql
  query resultSet($query: String, $filters: [FiltersSet], $page: PageInput, $sortBy: String) {
```

now:
```
  query resultSet($query: String, $filters: [SKFiltersSet], $page: SKPageInput, $sortBy: String) {
```

2. Update the items node to specify the type
Before:
```
items {
  id
  fields {
    title
    writers
    actors
    plot
    poster
  }
}
```

After:
```
items {
  ... on ResultHit {
    id
    fields {
      title
      writers
      actors
      plot
      poster
    }
  }
}
```