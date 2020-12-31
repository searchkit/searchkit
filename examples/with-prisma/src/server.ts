import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express';
import { createContext } from './context';
import { createServer } from 'http';
import express from 'express';
import { schema } from './schema';
import { stitchSchemas } from 'graphql-tools'

import {
  MultiMatchQuery,
  SearchkitSchema
} from '@searchkit/schema'

const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: []
  },
  query: new MultiMatchQuery({ fields: [] }),
  facets: []
}

const { PORT = 5000 } = process.env;

const app = express();
const server = createServer(app);

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'Result', // base typename.
  addToQueryType: true // When true, adds a field called results to Query type
})

const SearchkitExecutableSchema = makeExecutableSchema(
  {
    typeDefs: [
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
    ],
    resolvers: withSearchkitResolvers({})
  }
)

const apollo = new ApolloServer({
  schema: stitchSchemas({
    subschemas: [
      { schema: schema },
      { schema: SearchkitExecutableSchema }
    ]
  }),
  context: createContext(context),
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
});
apollo.applyMiddleware({ app });

server.listen({ port: PORT }, () => {
  process.stdout.write(
    `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}\n`,
  );
});
