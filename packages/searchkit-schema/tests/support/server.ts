import { ApolloServer, gql } from 'apollo-server-micro'
import { SearchkitSchema, SearchkitConfig, SearchkitResolver, SearchkitSchemaConfig } from '../../src/index'

const baseTypeDefs = gql`
    type Query {
      root: String
    }

    type Mutation {
      root: String
    }

    type HitFields {
      title: String
      writers: [String]
      actors: [String]
      plot: String
      poster: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }

  `

  const userTypeDefs = gql`
    type UserResultHit implements SKHit {
      id: ID!
      fields: UserFields
      profile: UserResultProfile
    }

    type UserResultProfile {
      name: String
    }

    type UserFields {
      tags: [String]
    }

    type Account {
      id: ID!
      userResults(query: String, filters: [SKFiltersSet], page: SKPageInput): UserResultSet
    }

    extend type Query {
      account(id: String): Account
    }
  `

class Server {
  config: SearchkitSchemaConfig | Array<SearchkitSchemaConfig>

  constructor(config: SearchkitSchemaConfig | Array<SearchkitSchemaConfig>) {
    this.config = config
  }

  setupApolloServer() {
    const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema(this.config)

    let td
    let r

    if (Array.isArray(this.config)) {
      // multiple configurations, used in customisation.test integration test
      td = [...typeDefs, baseTypeDefs, userTypeDefs]
      r = withSearchkitResolvers({
        Query: {
          account: () => {
            return {
              id: 1
            }
          }
        },
        Account: {
          userResults: SearchkitResolver
        }
      })
    } else {
      // when only one config, the default searchkit
      td = [...typeDefs, baseTypeDefs]
      r = withSearchkitResolvers()
    }

    const server = new ApolloServer({
      typeDefs: td,
      resolvers: r,
      introspection: true,
      playground: true,
      context: {
        ...context
      }
    })
    return server.createHandler({ path: '/api/graphql' })
  }
}
export default Server
