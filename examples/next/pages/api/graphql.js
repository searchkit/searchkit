import { ApolloServer, gql } from 'apollo-server-micro'
import cors from 'micro-cors'

import {
  MultiMatchQuery,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitResolvers,
  SearchkitSchema,
  DateRangeFacet
} from '@searchkit/apollo-resolvers'

const searchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'movies',
  hits: {
    fields: ['title', 'actors', 'writers', 'plot', 'poster']
  },
  sortOptions: [
    { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true},
    { id: 'released', label: "Released", field: [{"released": "desc"}]},    
  ],
  query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
  facets: [
    new RefinementSelectFacet({ field: 'type.raw', id: 'type', label: 'Type' }),
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
    new RefinementSelectFacet({
      field: 'actors.raw',
      id: 'actors',
      label: 'Actors'
    }),
    new RefinementSelectFacet({
      field: 'writers.raw',
      id: 'writers',
      label: 'Writers',
      multipleSelect: true
    }),
    new RefinementSelectFacet({
      field: 'countries.raw',
      id: 'countries',
      label: 'Countries',
      display: 'ComboBoxFacet'
    }),
    new RefinementSelectFacet({ field: 'genres.raw', id: 'genres', label: 'Genres' }),
    new RefinementSelectFacet({
      field: 'rated.raw',
      id: 'rated',
      label: 'Rated'
    }),
    new DateRangeFacet({
      field: 'released',
      id: 'released',
      label: 'Released'
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

    # extend type Hit {
    #   exampleCustomField: String
    # }
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
    ...SearchkitResolvers(searchkitConfig)
    // Hit: {
    //   exampleCustomField: (parent) => `Example Return Value for ${parent.id}`
    // }
  },
  introspection: true,
  playground: true,
  context: {}
})

const handler = server.createHandler({ path: '/api/graphql' })

export default cors()((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))
