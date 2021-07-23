import { ApolloServer, gql } from 'apollo-server-micro'
import cors from 'micro-cors'

import {
  MultiMatchQuery,
  RefinementSelectFacet,
  RangeFacet,
  SearchkitSchema,
  DateRangeFacet,
  SearchkitResolver,
  GeoBoundingBoxFilter,
  HierarchicalMenuFacet
} from '@searchkit/schema'

const searchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'imdb_movies',
  hits: {
    fields: ['type','title','year','rated','released','genres','directors','writers','actors','countries','plot','poster','id']
  },
  sortOptions: [
    { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true},
    { id: 'released', label: "Released", field: [{"released": "desc"}]},
  ],
  query: new MultiMatchQuery({ fields: ['title','genres','directors','writers','actors','countries','plot'] }),
  facets: [
    new RefinementSelectFacet({
      field: 'type',
      identifier: 'type',
      label: 'Type',
      multipleSelect: true
    }),
    new RangeFacet({
      field: 'metascore',
      identifier: 'metascore',
      label: 'Metascore',
      range: {
        min: 0,
        max: 100,
        interval: 5
      }
    }),
    new DateRangeFacet({
      field: 'released',
      identifier: 'released',
      label: 'Released'
    }),

    new RefinementSelectFacet({
      field: 'genres.keyword',
      identifier: 'genres',
      label: 'Genres',
      multipleSelect: true
    }),

    new RefinementSelectFacet({
      field: 'countries.keyword',
      identifier: 'countries',
      label: 'Countries',
      display: 'ComboBoxFacet'
    }),
    new RefinementSelectFacet({
      field: 'rated',
      identifier: 'rated',
      label: 'Rated',
      multipleSelect: true
    }),
    new RefinementSelectFacet({
      field: 'directors.keyword',
      identifier: 'directors',
      label: 'Directors'
    }),

    new RefinementSelectFacet({
      field: 'writers.keyword',
      identifier: 'writers',
      label: 'Writers'
    }),

    new RefinementSelectFacet({
      field: 'actors.keyword',
      identifier: 'actors',
      label: 'Actors',
      multipleSelect: true
    }),

    new RangeFacet({
      field: 'imdbrating',
      identifier: 'imdbrating',
      label: 'IMDB Rating',
      range: {
        interval: 1,
        max: 10,
        min: 1
      }
    })
  ]
}

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
  filters: [
    new GeoBoundingBoxFilter({
      field: 'location',
      label: "Location",
      identifier: "location"
    })
  ],
  facets: [
    new RefinementSelectFacet({
      field: 'states',
      identifier: 'states',
      label: "States",
      multipleSelect: true
    })
  ]
}

const productsConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'mrp-products',
  hits: {
    fields: [
      'name', 'location'
    ]
  },
  query: new MultiMatchQuery({ fields: ['designerName^3', 'name'] }),
  facets: [
    new HierarchicalMenuFacet({
      fields: [ 'category_lvl1.keyword', 'category_lvl2.keyword', 'category_lvl3.keyword' ],
      label: 'Category',
      identifier: 'category',
    })
  ]
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema([{
  config: searchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: true
}, {
  config: productsConfig,
  typeName: 'productsResultSet',
  hitTypeName: 'ProductHit',
  addToQueryType: false
}, {
  config: usParksConfig,
  typeName: 'ParkResultSet',
  hitTypeName: 'ParkResultHit',
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
      writers: [String]
      actors: [String]
      plot: String
      poster: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
      customField: String
    }

    type ParkHitFields {
      title: String
      location: String
      states: [String]
      nps_link: String
      description: String
    }

    type ProductHitFields {
      imageURL: String
      designerName: String
      name: String
      price: Float
    }

    type ParkResultHit implements SKHit {
      id: ID!
      fields: ParkHitFields
    }

    type ProductHit implements SKHit {
      id: ID!
      fields: ProductHitFields
    }

    extend type Query {
      usParks(query: String, filters: [SKFiltersSet], page: SKPageInput): ParkResultSet
      products(query: String, filters: [SKFiltersSet], page: SKPageInput): productsResultSet
    }
  `, ...typeDefs
  ],
  resolvers: withSearchkitResolvers({
    ResultHit: {
      customField: (parent) => `parent id ${parent.id}`
    },
    Query: {
      usParks: SearchkitResolver,
      products: SearchkitResolver
    }
  }),
  introspection: true,
  playground: true,
  context: {
    ...context
  }
})

const handler = server.createHandler({ path: '/api/graphql' })

export default cors()((req, res) => req.method === 'OPTIONS' ? res.end() : handler(req, res))
