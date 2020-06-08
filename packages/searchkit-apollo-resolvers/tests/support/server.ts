import { ApolloServer, gql } from 'apollo-server-micro'
import { HitsResolver, ResultsResolver, FacetsResolver, SummaryResolver } from '../../src/index'
// import { ResultsResolver } from

const resolvers = (config) => ({
  ResultSet: {
    hits: HitsResolver,
    facets: FacetsResolver,
    // facet: FacetResolver,
    summary: SummaryResolver
  },
  Query: {
    results: ResultsResolver(config)
  },
  FacetSet: {
    __resolveType: (e) => e.type
  }
})

const typeDefs = [
  gql`
    type Query {
      root: String
    }

    type Mutation {
      root: String
    }

    type Hit {
      id: String
      fields: HitFields
    }

    type HitFields {
      title: String
      writers: [String]
      actors: [String]
    }

    type Summary {
      total: Float
      appliedFilters: [SelectedFilter]
      query: String
    }

    type SelectedFilter {
      id: String
      label: String
      value: String
    }

    type ResultSet {
      summary: Summary
      hits(page: PageInput): HitResults
      facets: [FacetSet]
      facet(id: String!, query: String, page: PageInput): FacetSet
    }

    type PageInfo {
      total: Float
      totalPages: Float
      pageNumber: Float
      from: Float
      size: Float
    }

    type HitResults {
      items: [Hit]
      page: PageInfo
    }

    input PageInput {
      from: Float
      size: Float
    }

    input FiltersSet {
      id: String
      selected: [String]
    }

    interface FacetSet {
      id: String
      label: String
      type: String
      entries: [FacetSetEntry]
    }

    type FacetSetEntry {
      id: String
      label: String
      count: Float
      isSelected: Boolean
    }

    type RefinementSelectFacet implements FacetSet {
      id: String
      label: String
      type: String
      entries: [FacetSetEntry]
    }

    type MultipleSelectFacet implements FacetSet {
      id: String
      label: String
      type: String
      entries: [FacetSetEntry]
    }

    extend type Query {
      results(query: String, filters: [FiltersSet]): ResultSet
    }
  `
]

class Server {
  logger

  constructor(config) {
    this.config = config
  }

  setupApolloServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers: resolvers(this.config),
      introspection: true,
      playground: true,
      context: {}
    })
    return server.createHandler({ path: '/api/graphql' })
  }
}
export default Server
