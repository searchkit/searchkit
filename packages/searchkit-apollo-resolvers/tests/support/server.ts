import { ApolloServer, gql } from 'apollo-server-micro'
import { SearchkitResolvers, SearchkitSchema, SearchkitConfig } from '../../src/index'

const typeDefs = [
  gql`
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
  `,
  SearchkitSchema
]

class Server {
  config: SearchkitConfig

  constructor(config: SearchkitConfig) {
    this.config = config
  }

  setupApolloServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers: {
        ...SearchkitResolvers(this.config)
      },
      introspection: true,
      playground: true,
      context: {}
    })
    return server.createHandler({ path: '/api/graphql' })
  }
}
export default Server
