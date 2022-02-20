import gql from 'graphql-tag'
import { SearchkitConfig } from '@searchkit/sdk'
import {
  FacetsResolver,
  HitsResolver,
  SearchkitResolver,
  SummaryResolver,
  FacetResolver
} from './resolvers'

const baseSearchkitTypeDefs = gql`
  type SKSortOption {
    id: ID!
    label: String!
  }

  type SKSummary {
    total: Float!
    appliedFilters: [SKSelectedFilter]
    disabledFilters: [SKDisabledFilter]
    query: String
    sortOptions: [SKSortOption]
  }

  type SKDisabledFilter {
    identifier: String!
  }

  interface SKSelectedFilter {
    id: ID!
    identifier: String!
    label: String!
    display: String!
  }

  type ValueSelectedFilter implements SKSelectedFilter {
    id: ID!
    identifier: String!
    display: String!
    label: String!
    value: String!
  }

  type NumericRangeSelectedFilter implements SKSelectedFilter {
    id: ID!
    identifier: String!
    label: String!
    display: String!
    min: Float
    max: Float
  }

  type DateRangeSelectedFilter implements SKSelectedFilter {
    id: ID!
    identifier: String!
    label: String!
    display: String!
    dateMin: String!
    dateMax: String!
  }

  type GeoBoundingBoxSelectedFilter implements SKSelectedFilter {
    id: ID!
    identifier: String!
    label: String!
    display: String!
    topLeft: SKGeoPoint
    bottomRight: SKGeoPoint
    bottomLeft: SKGeoPoint
    topRight: SKGeoPoint
  }

  type HierarchicalValueSelectedFilter implements SKSelectedFilter {
    id: ID!
    identifier: String!
    label: String!
    display: String!
    level: Int!
    value: String!
  }

  type SKGeoPoint {
    lat: Float!
    lon: Float!
  }

  type SKPageInfo {
    total: Float
    totalPages: Float
    pageNumber: Float
    from: Float
    size: Float
  }

  type SKHitResults {
    items: [SKHit]
    page: SKPageInfo
    sortedBy: String
  }

  interface SKHit {
    id: ID!
  }

  input SKPageInput {
    from: Float
    size: Float
  }

  input SKQueryOptions {
    fields: [String]
  }

  input SKFiltersSet {
    identifier: String!
    value: String
    min: Float
    max: Float
    dateMin: String
    dateMax: String
    geoBoundingBox: SKGeoBoundingBoxInput
    level: Int
  }

  input SKGeoBoundingBoxInput {
    topLeft: SKGeoPointInput
    bottomRight: SKGeoPointInput
    topRight: SKGeoPointInput
    bottomLeft: SKGeoPointInput
  }

  input SKGeoPointInput {
    lat: Float!
    lon: Float!
  }

  interface SKFacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [SKFacetSetEntry]
  }

  type SKFacetSetEntry {
    label: String
    count: Float
    isSelected: Boolean
    level: Int
    entries: [SKFacetSetEntry]
  }

  type RefinementSelectFacet implements SKFacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [SKFacetSetEntry]
  }

  type RangeFacet implements SKFacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [SKFacetSetEntry]
  }

  type DateRangeFacet implements SKFacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [SKFacetSetEntry]
  }

  type HierarchicalMenuFacet implements SKFacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [SKFacetSetEntry]
  }
`

export interface SearchkitSchemaConfig {
  typeName: string
  hitTypeName: string
  config: SearchkitConfig
  addToQueryType?: boolean
  getBaseFilters?: any
}

export default (schemaConfigs: SearchkitSchemaConfig | Array<SearchkitSchemaConfig>) => {
  const { typeDefs, context, resolvers } = (
    Array.isArray(schemaConfigs) ? schemaConfigs : [schemaConfigs]
  ).reduce(
    (sum, schemaConfig) => {
      const typeName = schemaConfig.typeName

      const extendQuery = schemaConfig.addToQueryType
        ? `
    extend type Query {
      results(query: String, queryOptions: SKQueryOptions, filters: [SKFiltersSet], page: SKPageInput): ${typeName}
    }`
        : ''

      const configTypeDefs = gql`
      type ${typeName} {
        summary: SKSummary
        hits(page: SKPageInput, sortBy: String): SKHitResults
        facets: [SKFacetSet]
        facet(identifier: String!, query: String, size: Float): SKFacetSet
      }

      ${extendQuery}
    `

      return {
        typeDefs: [...sum.typeDefs, configTypeDefs],
        resolvers: {
          ...sum.resolvers,
          [typeName]: {
            hits: HitsResolver,
            facets: FacetsResolver,
            facet: FacetResolver,
            summary: SummaryResolver
          },
          ...(schemaConfig.addToQueryType
            ? {
                Query: {
                  ...sum.resolvers.Query,
                  results: SearchkitResolver
                }
              }
            : {
                Query: sum.resolvers.Query
              })
        },
        context: {
          searchkit: {
            configs: {
              ...sum.context.searchkit.configs,
              [typeName]: schemaConfig.config
            },
            baseFilters: {
              ...sum.context.searchkit.baseFilters,
              [typeName]: schemaConfig.getBaseFilters
            },
            hitTypeMappings: {
              ...sum.context.searchkit.hitTypeMappings,
              [typeName]: schemaConfig.hitTypeName
            }
          }
        }
      }
    },
    {
      typeDefs: [baseSearchkitTypeDefs],
      resolvers: {
        SKHit: {
          __resolveType: (e) => e.type
        },
        SKFacetSet: {
          __resolveType: (e) => e.type
        },
        SKSelectedFilter: {
          __resolveType: (e) => e.type
        },
        Query: {}
      },
      context: {
        searchkit: {
          configs: {},
          baseFilters: {},
          hitTypeMappings: {}
        }
      }
    }
  )

  return {
    typeDefs,
    withSearchkitResolvers: (userResolvers: any = {}) => ({
      ...userResolvers,
      ...resolvers,
      Query: {
        ...userResolvers.Query,
        ...resolvers.Query
      }
    }),
    context
  }
}
