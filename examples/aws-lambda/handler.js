const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  MultiMatchQuery,
  SearchkitSchema,
  RefinementSelectFacet
} = require('@searchkit/schema')

const searchkitConfig = {
  host: "http://localhost:9200",
  index: 'imdb_movies',
  hits: {
    fields: ['title']
  },
  query: new MultiMatchQuery({ fields: ['title'] }),
  facets: [
    new RefinementSelectFacet({ field: 'type.raw', identifier: 'type', label: 'Type' })
  ]
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'ResultSet', // base typename
  hitTypeName: 'ResultHit',
  addToQueryType: true // When true, adds a field called results to Query type
})

const combinedTypeDefs = [
  ...typeDefs,
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
  `

]

const server = new ApolloServer({
  typeDefs: combinedTypeDefs,
  resolvers: withSearchkitResolvers({}),
  playground: true,
  introspection: true,
  context: {
    ...context
  }
});

exports.graphqlHandler = server.createHandler();
