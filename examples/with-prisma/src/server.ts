import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express';
import { createContext } from './context';
import { createServer } from 'http';
import express from 'express';
import { schema } from './schema';
import { stitchSchemas } from 'graphql-tools'

import {
  MultiMatchQuery,
  SearchkitResolvers,
  SearchkitSchema
} from '@searchkit/apollo-resolvers'

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

const SearchkitExecutableSchema = makeExecutableSchema(
  {
    typeDefs: [
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
    ],
    resolvers: SearchkitResolvers(searchkitConfig)
  }
)

const apollo = new ApolloServer({
  schema: stitchSchemas({
    subschemas: [
      { schema: schema },
      { schema: SearchkitExecutableSchema }
    ]
  }),
  context: createContext,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
});
apollo.applyMiddleware({ app });

server.listen({ port: PORT }, () => {
  process.stdout.write(
    `🚀 Server ready at http://localhost:${PORT}${apollo.graphqlPath}\n`,
  ); 
});
