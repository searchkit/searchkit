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
    new RefinementSelectFacet({ field: 'type.raw', identifier: 'type', label: 'Type' }),
    new RangeFacet({
      field: 'metaScore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new RefinementSelectFacet({
      field: 'actors.raw',
      identifier: 'actors',
      label: 'Actors'
    }),
    new RefinementSelectFacet({
      field: 'writers.raw',
      identifier: 'writers',
      label: 'Writers',
      multipleSelect: true
    }),
    new RefinementSelectFacet({
      field: 'countries.raw',
      identifier: 'countries',
      label: 'Countries',
      display: 'ComboBoxFacet'
    }),
    new RefinementSelectFacet({ field: 'genres.raw', identifier: 'genres', label: 'Genres' }),
    new RefinementSelectFacet({
      field: 'rated.raw',
      identifier: 'rated',
      label: 'Rated'
    }),
    new DateRangeFacet({
      field: 'released',
      identifier: 'released',
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
  introspection: false,
  playground: true,
  context: {}
})

const handler = server.createHandler({ path: '/api/graphql' })

export default cors()((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))
