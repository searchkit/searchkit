import type { SearchResults, SearchParameters } from 'algoliasearch-helper'

export const lastResults: SearchResults = {
  nbHits: 100,
  hits: []
} as unknown as SearchResults

export const state: SearchParameters = {
  disjunctiveFacetsRefinements: {
    brand: ['Apple', 'Samsung']
  },
  numericRefinements: {
    price: {
      '>=': [100],
      '<=': [1000]
    },
    rating: {
      '>=': [4]
    },
    metascore: {
      '<=': [4]
    },
    stock: {
      '>=': []
    },
    stockBothRangeEmpty: {
      '>=': [],
      '<=': []
    }
  },
  query: 'iphone',
  page: 0,
  hitsPerPage: 20
} as unknown as SearchParameters
