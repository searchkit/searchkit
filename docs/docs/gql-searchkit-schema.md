---
id: gql-searchkit-schema
title: Searchkit Schema
sidebar_label: '@searchkit/schema'
slug: /graphql/reference/schema
---

## Initial Setup

```javascript

import {
  MultiMatchQuery,
  SearchkitSchema
} from '@searchkit/schema'

const searchkitConfig = {
  host: 'http://localhost:9200', // elasticsearch instance url
  index: 'my_index', // elasticsearch index
  connectionOptions: { // optional options. Common example for authentication
    apiKey: "sdccdcdc",
    headers: {
      'x-custom-header': "customValue"
    }
  }
  hits: {
    fields: []
  },
  query: new MultiMatchQuery({ fields: [] }),
  facets: []
}

// Returns SDL + Resolvers for searchkit, based on the Searchkit config
const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'ResultSet', // type name for Searchkit Root
  hitTypeName: 'ResultHit', // type name for each search result
  addToQueryType: true // When true, adds a field called results to Query type
})

const server = new ApolloServer({
  typeDefs: [
    gql`
    type Query {
      root: String
    }

    type HitFields {
      root: String
    }

    // Type name should match the hit typename
    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }
  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({}),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})

```

Key points:

1. `SearchkitSchema` returns the schema definition language (SDL), the resolvers and the context for searchkit required. SearchkitSchema requires a searchkit config and two typenames, one for the Searchkit Root (typeName) and another for the Hit item (hitTypeName).
2. You need to define a type for each hit item. In above example, `ResultHit` is the type used for each hit result. This type needs to implement the SKHit interface and requires at least one field
3. `addToQueryType` adds a `results` field to the root Query object which is handled the Searchkit resolver.

#### Options

| Option | Description |
| :-- | :-- |
| config | Searchkit config |
| typeName | String. The root type name for searchkit. |
| hitTypeName | String. The hit type that will be used for all hits. Should match a type you have implemented. See ResultHit example above |
| addToQueryType | Boolean. Adds a `results` field to the root Query object which is handled the Searchkit resolver. Set this to false if you want to implement the searchkit root field yourself. See [Customising GraphQL field](https://www.searchkit.co/docs/customisations/changing-graphql-types) section for more information |
| getBaseFilters | Allows you to pass an array of elasticsearch queries to filter results by. See [Adding base filters documentation](https://www.searchkit.co//docs/customisations/add-base-filters) for more information. |

### Customising the Searchkit Types

- typeName: Specifies the type name used for the Searchkit root query. Configured on SearchkitSchema options.
- hitTypeName: specifies the hit type name used for each result hit. Configured on SearchkitSchema options.

### Customising GraphQL field

See [Customising types](https://www.searchkit.co/docs/customisations/changing-graphql-types)

### Multiple Searchkit configurations

see [Adding multiple searchkit configurations](https://www.searchkit.co/docs/customisations/multiple-searchkit-configurations)

# Searchkit Configuration

See [Searchkit SDK](https://searchkit.co/docs/reference/searchkit-sdk) on searchkit configurations. Searchkit Schema uses SDK behind the scenes.
