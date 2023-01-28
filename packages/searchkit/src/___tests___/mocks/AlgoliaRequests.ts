export const SimpleRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facetFilters: [['type:movie']],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: 'shawshank',
      tagFilters: ''
    }
  }
]

export const nonDynamicFacetRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facets: ['type', 'actors', 'imdbrating'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const nonDynamicFacetRequestOneFilter = [
  {
    indexName: 'imdb_movies',
    params: {
      facetFilters: [['actors:Alice']],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const DisjunctiveExampleRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facetFilters: [['type:movie']],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: 'shawshank',
      tagFilters: ''
    }
  },
  {
    indexName: 'imdb_movies',
    params: {
      analytics: false,
      attributesToHighlight: [],
      attributesToRetrieve: [],
      attributesToSnippet: [],
      clickAnalytics: false,
      facets: 'type',
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      hitsPerPage: 1,
      maxValuesPerFacet: 10,
      page: 0,
      query: 'shawshank',
      tagFilters: ''
    }
  }
]

export const NestedQueryRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facetFilters: [['user.first:Alice']],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  },
  {
    indexName: 'imdb_movies',
    params: {
      analytics: false,
      attributesToHighlight: [],
      attributesToRetrieve: [],
      attributesToSnippet: [],
      clickAnalytics: false,
      facets: 'user.first',
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      hitsPerPage: 1,
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const TwoFiltersNestedQueryRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facetFilters: [['user.first:Alice', 'user.first:John']],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  },
  {
    indexName: 'imdb_movies',
    params: {
      analytics: false,
      attributesToHighlight: [],
      attributesToRetrieve: [],
      attributesToSnippet: [],
      clickAnalytics: false,
      facets: 'user.first',
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      hitsPerPage: 1,
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const NumericFilterNestedQueryRequest = [
  {
    indexName: 'my-index-000001',
    params: {
      facetFilters: [],
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      numericFilters: ['user.price>=90'],
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const FacetQueryExampleRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facetName: 'type',
      facetQuery: 'm',
      facets: ['*'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxFacetHits: 10,
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]

export const NumericFiltersExampleRequest = [
  {
    indexName: 'imdb_movies',
    params: {
      facets: ['type', 'actors', 'imdbrating'],
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      maxValuesPerFacet: 10,
      numericFilters: ['imdbrating>=90'],
      page: 0,
      query: '',
      tagFilters: ''
    }
  },
  {
    indexName: 'imdb_movies',
    params: {
      analytics: false,
      clickAnalytics: false,
      facets: 'imdbrating',
      highlightPostTag: '</em>',
      highlightPreTag: '<em>',
      hitsPerPage: 0,
      maxValuesPerFacet: 10,
      page: 0,
      query: ''
    }
  }
]

export const NestedFacetQueryExampleRequest = [
  {
    indexName: 'my-index-000001',
    params: {
      facetName: 'user.first',
      facetQuery: 'har',
      facets: ['user.first', 'user.price'],
      highlightPostTag: '</ais-highlight-0000000000>',
      highlightPreTag: '<ais-highlight-0000000000>',
      maxFacetHits: 10,
      maxValuesPerFacet: 10,
      page: 0,
      query: '',
      tagFilters: ''
    }
  }
]
