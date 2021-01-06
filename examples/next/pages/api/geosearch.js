import { ApolloServer, gql } from 'apollo-server-micro'
import cors from 'micro-cors'

import {
  MultiMatchQuery,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitSchema,
  DateRangeFacet,
  SearchkitResolver,
  GeoBoundingBoxFacet
} from '@searchkit/schema'

const usParksConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'us_parks',
  hits: {
    fields: [
      'title',
      'location'
    ]
  },
  query: new MultiMatchQuery({ fields: ['title'] }),
  facets: [
    new GeoBoundingBoxFacet({
      field: 'location',
      label: "Location",
      identifier: "location"
    })
  ]
}

const bikeHireConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'bike_hire_stations',
  hits: {
    fields: [
      'name', 'location'
    ]
  },
  query: new MultiMatchQuery({ fields: ['name'] }),
  facets: [
    new GeoBoundingBoxFacet({
      field: 'location',
      label: "Location",
      identifier: "location"
    })
  ]
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema([{
  config: bikeHireConfig,
  typeName: 'BikeHireResultSet',
  hitTypeName: 'BikeHireHit',
  addToQueryType: false
}, {
  config: usParksConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: false
}])

export const config = {
  api: {
    bodyParser: false
  }
}

const server = new ApolloServer({
  typeDefs: [
    gql`
    type Query {
      root: String
    }

    type HitFields {
      title: String
      location: String
    }

    type BikeHireHitFields {
      name: String
      location: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }

    type BikeHireHit implements SKHit {
      id: ID!
      fields: BikeHireHitFields
    }

    extend type Query {
      usParks(query: String, filters: [SKFiltersSet], page: SKPageInput): ResultSet
      bikeHireStations(query: String, filters: [SKFiltersSet], page: SKPageInput): BikeHireResultSet
    }
  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({
    Query: {
      usParks: SearchkitResolver,
      bikeHireStations: SearchkitResolver
    }
  }),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})

const handler = server.createHandler({ path: '/api/geosearch' })

export default cors()((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))
