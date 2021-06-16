const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  MultiMatchQuery,
  SearchkitSchema,
  RefinementSelectFacet,
  RangeFacet
} = require('@searchkit/schema')

const productSearchkitConfig = {
  host: process.env.ES_HOST || 'http://localhost:9200',
  index: 'mrp-products',
  hits: {
    fields: ['id','name','designerName','imageURL','price','colour','sizes','category_lvl1','category_lvl2']
  },
  sortOptions: [
    { id: 'relevance', label: "Relevance", field: [{"_score": "desc"}], defaultOption: true},
    { id: 'price', label: "Cheapest Price", field: [{ "price": "desc"}]}
  ],
  query: new MultiMatchQuery({ fields: ['name','designerName','colour','sizes','category_lvl1','category_lvl2'] }),
  facets: [
    new RefinementSelectFacet({
      field: 'designerName.keyword',
      identifier: 'designerName',
      label: 'designerName'
    }),
    new RangeFacet({
      field: 'price',
      identifier: 'price',
      label: 'price',
      range: {
        min: 10,
        max: 1000,
        interval: 1000
      }
    }),
    new RefinementSelectFacet({
      field: 'colour.keyword',
      identifier: 'colour',
      label: 'colour'
    }),
    new RefinementSelectFacet({
      field: 'sizes.keyword',
      identifier: 'sizes',
      label: 'sizes'
    }),
    new RefinementSelectFacet({
      field: 'category_lvl1.keyword',
      identifier: 'category_lvl1',
      label: 'category_lvl1'
    }),
    new RefinementSelectFacet({
      field: 'category_lvl2.keyword',
      identifier: 'category_lvl2',
      label: 'category_lvl2'
    }),
  ]
}

const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: productSearchkitConfig,
  typeName: 'ResultSet',
  hitTypeName: 'ResultHit',
  addToQueryType: true
})

const combinedTypeDefs = [
  ...typeDefs,
  gql`
    type Query {
      root: String
    }

    type ProductHitFields {
      id: String
      name: String
      designerName: String
      imageURL: String
      price: String
      colour: String
      sizes: String
      category_lvl1: String
      category_lvl2: String
    }

    type ResultHit implements SKHit {
      id: ID!
      fields: ProductHitFields
    }
  `]

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
