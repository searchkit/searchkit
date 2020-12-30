---
id: guides-upgrade-rc25
title: RC25 Update Notes
sidebar_label: RC25 Update
slug: /guides/update-notes-rc25
---

## Steps

First update the dependencies from `@searchkit/apollo-resolvers` to `@searchkit/schema`

package.json

```
-    "@searchkit/apollo-resolvers": "^3.0.0-canary.24",
+    "@searchkit/schema": "^3.0.0-canary.25",
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
  resolvers: withSearchkitResolvers(),
  playground: true,
  introspection: true,
  context: {
    ...context
  }
});
```
