import { ApolloServer, gql } from 'apollo-server-micro'
import {
  HitsResolver,
  ResultsResolver,
  FacetsResolver,
  MultiMatchQuery,
  MultipleSelectFacet,
  RefinementSelectFacet,
  SummaryResolver
} from '@searchkit/apollo-resolvers'

const searchkitConfig = {
  host: 'http://localhost:9200/movies/_search',
  hits: {
    fields: ['actors', 'writers', 'plot', 'poster']
  },
  query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
  facets: [
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

const resolvers = () => ({
  ResultSet: {
    hits: HitsResolver,
    facets: FacetsResolver,
    // facet: FacetResolver,
    summary: SummaryResolver
  },
  Query: {
    results: ResultsResolver(searchkitConfig)
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
      plot: String
      poster: String
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
      results(query: String, filters: [FiltersSet], page: PageInput): ResultSet
    }
  `
]

export const config = {
  api: {
    bodyParser: false
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers(searchkitConfig),
  introspection: true,
  playground: true,
  context: {}
})

export default server.createHandler({ path: '/api/graphql' })
