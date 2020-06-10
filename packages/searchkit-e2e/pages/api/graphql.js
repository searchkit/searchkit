import { ApolloServer, gql } from 'apollo-server-micro'
import {
  MultiMatchQuery,
  MultipleSelectFacet,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitResolvers,
  SearchkitSchema
} from '@searchkit/apollo-resolvers'

const searchkitConfig = {
  host: 'http://localhost:9200/movies/_search',
  hits: {
    fields: ['actors', 'writers', 'plot', 'poster']
  },
  query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
  facets: [
    new RangeFacet({
      field: 'metaScore',
      id: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new RefinementSelectFacet({ field: 'type.raw', id: 'type', label: 'Type' }),
    new RefinementSelectFacet({
      field: 'actors.raw',
      id: 'actors',
      label: 'Actors'
    }),
    new MultipleSelectFacet({
      field: 'writers.raw',
      id: 'writers',
      label: 'Writers',
      selector: 'OR'
    }),
    new RefinementSelectFacet({ field: 'countries.raw', id: 'countries', label: 'Countries' }),
    new RefinementSelectFacet({ field: 'genres.raw', id: 'genres', label: 'Genres' }),
    new RefinementSelectFacet({
      field: 'rated.raw',
      id: 'rated',
      label: 'Rated'
    })
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
      writers: [String]
      actors: [String]
      plot: String
      poster: String
    }

    extend type Hit {
      exampleCustomField: String
    }
  `,
  SearchkitSchema
]

export const config = {
  api: {
    bodyParser: false
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    ...SearchkitResolvers(searchkitConfig),
    Hit: {
      exampleCustomField: (parent) => `Example Return Value for ${parent.id}`
    }
  },
  introspection: true,
  playground: true,
  context: {}
})

export default server.createHandler({ path: '/api/graphql' })
