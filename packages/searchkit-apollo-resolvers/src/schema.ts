import gql from 'graphql-tag'

export default gql`
  type Hit {
    id: ID!
    fields: HitFields
  }

  type SortOption {
    id: ID!
    label: String!
  }

  type Summary {
    total: Float!
    appliedFilters: [SelectedFilter]
    query: String
    sortOptions: [SortOption]
  }

  interface SelectedFilter {
    identifier: String!
    label: String!
    display: String!
  }

  type ValueSelectedFilter implements SelectedFilter {
    identifier: String!
    display: String!
    label: String!
    value: String
  }

  type NumericRangeSelectedFilter implements SelectedFilter {
    identifier: String!
    label: String!
    display: String!
    min: Float
    max: Float
  }

  type DateRangeSelectedFilter implements SelectedFilter {
    identifier: String!
    label: String!
    display: String!
    dateMin: String
    dateMax: String
  }

  type ResultSet {
    summary: Summary
    hits(page: PageInput, sortBy: String): HitResults
    facets: [FacetSet]
    facet(identifier: String!, query: String, size: Float): FacetSet
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
    sortedBy: String
  }

  input PageInput {
    from: Float
    size: Float
  }

  input FiltersSet {
    identifier: String!
    value: String
    min: Float
    max: Float
    dateMin: String
    dateMax: String
  }

  interface FacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  type FacetSetEntry {
    id: ID!
    label: String
    count: Float
    isSelected: Boolean
  }

  type RefinementSelectFacet implements FacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  type RangeFacet implements FacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  type DateRangeFacet implements FacetSet {
    identifier: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  extend type Query {
    results(query: String, filters: [FiltersSet], page: PageInput): ResultSet
  }
`
