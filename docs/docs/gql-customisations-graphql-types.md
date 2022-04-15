---
id: gql-customisations-graphql-types
title: Customise Searchkit Schema
sidebar_label: Customise Searchkit Schema
slug: /graphql/customisations/changing-graphql-types
keywords: [Elasticsearch GraphQL API, customise GraphQL types]
description: Customise Searchkit Schema
---

When `addToQueryType` is true, searchkit will add a `results` field to the SDL which will use the Searchkit Resolver. For some, you may not want the field to be added to the root Query type and want to configure where the field should be. With addToQueryType set to false and putting in your own field in the SDL.

```es6
const moviesSearchConfig: SearchkitConfig = {
  host: 'http://localhost:9200',
  index: 'documents',
  hits: {
    fields: ['title', 'description']
  },
  query: new MultiMatchQuery({ fields: ['title', 'description'] })
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema(
  {
    typeName: 'ResultSet',
    hitTypeName: "ResultHit",
    config: moviesSearchConfig,
    addToQueryType: false
  }
]

const combinedTypeDefs = [
  gql`
  type Account {
    id: ID!
    results(query: String, filters: [SKFiltersSet], page: SKPageInput): ResultSet
  }

  type ResultHit implements SKHit {
    id: ID!
    fields: ResultFields
  }

  type ResultFields {
    title: String
    description: String
  }

  extend type Query {
    account(id: String): Account
  }
  `, ...typeDefs
]

const server = new ApolloServer({
  typeDefs: combinedTypeDefs,
  resolvers: withSearchkitResolvers({
    Query: {
      account: () => ({
        id: 1
      })
    },
    Account: {
      results: SearchkitResolver
    }
  }),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})
```

will enable a graphql query below and use the two searchkit configurations to return results

```gql
{
  account(id: "1") {
    id
    results(query: "test") {
      hits {
        items {
          ... on ResultHit {
            id
            fields {
              title
              description
            }
          }
        }
      }
    }
  }
}
```
