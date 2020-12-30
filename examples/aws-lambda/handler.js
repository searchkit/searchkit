const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  MultiMatchQuery,
  SearchkitSchema,
  RefinementSelectFacet
} = require('@searchkit/apollo-resolvers')

const searchkitConfig = {
  host: "https://user:pass@6773f6bc.qb0x.com:32359",
  index: 'movies',
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
  typeName: 'Result', // base typename
  addToQueryType: true // When true, adds a field called results to Query type
})

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

exports.graphqlHandler = server.createHandler();
