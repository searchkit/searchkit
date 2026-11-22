import type { MultipleQueriesQuery as AlgoliaV4Query } from '@algolia/client-search'
import type { AlgoliaMultipleQueriesQuery, MultipleQueriesQuery } from '../'

// Compile-time checks (ts-jest type-checks this file): requests typed with
// Algolia's v4 client must stay assignable to Searchkit's own request type.
describe('request types', () => {
  it('accepts Algolia v4 search and facet requests', () => {
    const algoliaRequests: AlgoliaV4Query[] = [
      {
        indexName: 'movies',
        params: {
          query: 'lion',
          page: 1,
          hitsPerPage: 10,
          facets: ['type'],
          facetFilters: [['type:movie', 'type:episode'], 'rated:PG'],
          numericFilters: ['year>=1990'],
          aroundLatLng: '51.5,-0.1',
          aroundRadius: 'all',
          insideBoundingBox: [[1, 2, 3, 4]],
          attributesToHighlight: ['title'],
          ruleContexts: ['home']
        }
      },
      { indexName: 'movies', type: 'facet', facet: 'type', params: { facetQuery: 'mov' } }
    ]

    const requests: readonly MultipleQueriesQuery[] = algoliaRequests
    const legacy: readonly AlgoliaMultipleQueriesQuery[] = requests

    expect(legacy[0].params?.query).toBe('lion')
    expect(legacy[1].params?.facetQuery).toBe('mov')
  })
})
