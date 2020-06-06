import { ApolloServer, gql } from 'apollo-server-micro'
import { HitsResolver, ResultsResolver } from '@searchkit/apollo-resolvers'
// import { ResultsResolver } from 

const resolvers = (config) => ({
  ResultSet: {
    hits: HitsResolver,
    // facets: FacetsResolver,
    // facet: FacetResolver,
    // summary: SummaryResolver
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
      time: Float
      filters: [SelectedFilters]
      query: String
    }

    type SelectedFilters {
      id: String
      label: String
      selected: [String]
    }

    type ResultSet {
      summary: Summary
      hits(page: PageInput): [Hit]
      facets: [FacetSet]
      facet(id: String!, query: String, page: PageInput): FacetSet
    }

    input PageInput {
      start: Float
      rows: Float
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

    type RefinementFacet implements FacetSet {
      id: String
      label: String
      type: String
      entries: [FacetSetEntry]
    }

    extend type Query {
      results(query: String, filters: [FiltersSet]): ResultSet
    }
  `,
];

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
