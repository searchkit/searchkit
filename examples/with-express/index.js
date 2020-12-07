const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  MultiMatchQuery,
  SearchkitResolvers,
  SearchkitSchema,
  RefinementSelectFacet
} = require('@searchkit/apollo-resolvers')

const searchkitConfig = {
  host: "https://user:pass@6773f6bc.qb0x.com:32359/",
  index: 'movies',
  hits: {
    fields: ['title']
  },
  query: new MultiMatchQuery({ fields: ['title'] }),
  facets: [
    new RefinementSelectFacet({ field: 'type.raw', identifier: 'type', label: 'Type' })
  ]
}

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
    }
  `,
  SearchkitSchema
]

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    ...SearchkitResolvers(searchkitConfig)
  },
  playground: true,
  introspection: true,
});
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
