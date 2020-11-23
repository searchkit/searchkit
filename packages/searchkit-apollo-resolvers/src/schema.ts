import gql from 'graphql-tag'

export default gql`
  type Hit {
    id: String
    fields: HitFields
  }

  type SortOption {
    id: String
    label: String
  }

  type Summary {
    total: Float
    appliedFilters: [SelectedFilter]
    query: String
    sortOptions: [SortOption]
  }

  type SelectedFilter {
    id: String
    label: String
    value: String
  }

  type ResultSet {
    summary: Summary
    hits(page: PageInput, sortBy: String): HitResults
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
    value: String
    min: Float
    max: Float
    dateMin: String
    dateMax: String
  }

  interface FacetSet {
    id: String
    label: String
    type: String
    display: String
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
    display: String
    entries: [FacetSetEntry]
  }

  type RangeFacet implements FacetSet {
    id: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  type DateRangeFacet implements FacetSet {
    id: String
    label: String
    type: String
    display: String
    entries: [FacetSetEntry]
  }

  extend type Query {
    results(query: String, filters: [FiltersSet], page: PageInput): ResultSet
  }
`
