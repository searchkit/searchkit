---
id: gql-customisations-graphql-multiple-configurations
title: Multiple Searchkit Schema Configurations
sidebar_label: Multiple Searchkit Schema Configurations
slug: /graphql/customisations/multiple-searchkit-configurations
keywords: [Elasticsearch GraphQL API, Multiple Search Schemas]
description: Having more than one Searchkit configuration for your GraphQL API
---

For different parts of the site, you may want a different search experience (searching on a different index, different facet configurations, different query implementations). SearchkitSchema function can accept multiple searchkit configurations. For each searchkit configuration, it will define the graphql schema + resolvers for SDL. An example of this shown below:

```javascript
const moviesSearchConfig: SearchkitConfig = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['actors', 'writers']
  },
  query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
}

const userSearchConfig: SearchkitConfig = {
  host: 'http://localhost:9200',
  index: 'users',
  hits: {
    fields: ['name', 'tags']
  },
  query: new MultiMatchQuery({ fields: ['name', 'tags'] })
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema([
  {
    typeName: 'ResultSet',
    hitTypeName: "ResultHit",
    config: moviesSearchConfig,
    addToQueryType: true
  },
  {
    typeName: 'UserResultSet',
    hitTypeName: "UserResultHit",
    config: userSearchConfig
  }
]

const combinedTypeDefs = [
  gql`
  type UserResultHit implements SKHit {
      id: ID!
      fields: UserFields
      profile: UserResultProfile
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: ResultFields
    }

    type ResultFields {
      actors: [String]
      writers: [String]
    }

    type UserResultProfile {
      name: String
    }

    type UserFields {
      tags: [String]
    }

    type Account {
      id: ID!
      // the Searchkit field with the UserResultSet type that matches the configuration
      userResults(query: String, filters: [SKFiltersSet], page: SKPageInput): UserResultSet
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
      // userResults field
      userResults: SearchkitResolver
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
  results(query: "test") {
    hits {
      sortedBy
      items {
        ... on ResultHit {
          id
          fields {
            writers
            actors
          }
        }
      }
    }
  }
  account(id: "1") {
    id
    userResults(query: "test") {
      hits {
        items {
          ... on UserResultHit {
            id
            profile {
              name
            }
            fields {
              tags
            }
          }
        }
      }
    }
  }
}
```
