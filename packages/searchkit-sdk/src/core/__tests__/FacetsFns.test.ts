import { SearchResponse } from '@elastic/elasticsearch-types/lib/api/types'
import { filterTransform, getAggregationsFromFacets, getFacetsFromResponse } from '../FacetsFns'
import QueryManager from '../QueryManager'
import { RefinementSelectFacet } from '../../facets'

describe('Facet Fns', () => {
  describe('getAggregationsFromFacets', () => {
    it('create aggregations for one facet ', () => {
      const qm = new QueryManager()
      qm.setFilters([{ identifier: 'test', value: 'testValue' }])
      const facetConfig = [
        new RefinementSelectFacet({ field: 'test', identifier: 'test', label: 'Test' })
      ]

      expect(getAggregationsFromFacets(qm, {}, facetConfig)).toMatchInlineSnapshot(`
        Object {
          "aggs": Object {
            "facet_bucket_all": Object {
              "aggs": Object {
                "test": Object {
                  "terms": Object {
                    "field": "test",
                    "size": 5,
                  },
                },
              },
              "filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "test": "testValue",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        }
      `)
    })

    it('create aggregations for two facets in all and one for Multiple select', () => {
      const qm = new QueryManager()
      qm.setFilters([
        { identifier: 'test', value: 'testValue' },
        { identifier: 'test3', value: 'testValue' }
      ])
      const facetConfig = [
        new RefinementSelectFacet({ field: 'test', identifier: 'test', label: 'Test' }),
        new RefinementSelectFacet({ field: 'test2', identifier: 'test2', label: 'Test 2' }),
        new RefinementSelectFacet({
          field: 'test3',
          identifier: 'test3',
          label: 'Test 3',
          multipleSelect: true
        })
      ]

      /*
        test 3 aggregrations are excluded from its own filters.
      */
      expect(getAggregationsFromFacets(qm, {}, facetConfig)).toEqual({
        aggs: {
          facet_bucket_all: {
            aggs: {
              test: { terms: { field: 'test', size: 5 } },
              test2: { terms: { field: 'test2', size: 5 } }
            },
            filter: {
              bool: {
                must: [
                  { bool: { must: [{ term: { test: 'testValue' } }] } },
                  { bool: { should: [{ term: { test3: 'testValue' } }] } }
                ]
              }
            }
          },
          facet_bucket_test3: {
            aggs: { test3: { terms: { field: 'test3', size: 5 } } },
            filter: { bool: { must: [{ bool: { must: [{ term: { test: 'testValue' } }] } }] } }
          }
        }
      })
    })
  })

  describe('getFacetsFromResponse', () => {
    it('should transform response from two facets', () => {
      const response: SearchResponse<unknown> = {
        took: 0,
        timed_out: false,
        _shards: { total: 0, successful: 0, failed: 0 },
        hits: {
          hits: [],
          max_score: 0,
          total: 0
        },
        aggregations: {
          facet_bucket_all: {
            doc_count: 84,
            test: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 0,
              buckets: [
                {
                  key: 'TV-14',
                  doc_count: 73
                },
                {
                  key: 'TV-PG',
                  doc_count: 7
                },
                {
                  key: 'PG',
                  doc_count: 2
                },
                {
                  key: 'PG-13',
                  doc_count: 2
                }
              ]
            },
            test2: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 114,
              buckets: [
                {
                  key: 'Naveen Andrews',
                  doc_count: 73
                },
                {
                  key: 'Emilie de Ravin',
                  doc_count: 53
                },
                {
                  key: 'Henry Ian Cusick',
                  doc_count: 39
                },
                {
                  key: 'Matthew Fox',
                  doc_count: 34
                },
                {
                  key: 'Michael Emerson',
                  doc_count: 23
                }
              ]
            }
          },
          facet_bucket_test3: {
            doc_count: 521,
            test3: {
              doc_count_error_upper_bound: 0,
              sum_other_doc_count: 1220,
              buckets: [
                {
                  key: 'J.J. Abrams',
                  doc_count: 78
                },
                {
                  key: 'Jeffrey Lieber',
                  doc_count: 72
                },
                {
                  key: 'Damon Lindelof',
                  doc_count: 69
                },
                {
                  key: 'James Manos Jr.',
                  doc_count: 53
                },
                {
                  key: 'Jeff Lindsay',
                  doc_count: 53
                }
              ]
            }
          }
        }
      }

      const facetConfig = [
        new RefinementSelectFacet({ field: 'test', identifier: 'test', label: 'Test 1' }),
        new RefinementSelectFacet({ field: 'test2', identifier: 'test2', label: 'Test 2' }),
        new RefinementSelectFacet({
          field: 'test3',
          identifier: 'test3',
          label: 'Test 3',
          multipleSelect: true
        })
      ]
      const qm = new QueryManager()
      expect(getFacetsFromResponse(facetConfig, response, qm)).toEqual([
        {
          entries: [
            { count: 73, label: 'TV-14' },
            { count: 7, label: 'TV-PG' },
            { count: 2, label: 'PG' },
            { count: 2, label: 'PG-13' }
          ],
          identifier: 'test',
          label: 'Test 1',
          display: 'ListFacet',
          type: 'RefinementSelectFacet'
        },
        {
          entries: [
            { count: 73, label: 'Naveen Andrews' },
            { count: 53, label: 'Emilie de Ravin' },
            { count: 39, label: 'Henry Ian Cusick' },
            { count: 34, label: 'Matthew Fox' },
            { count: 23, label: 'Michael Emerson' }
          ],
          identifier: 'test2',
          label: 'Test 2',
          display: 'ListFacet',
          type: 'RefinementSelectFacet'
        },
        {
          entries: [
            { count: 78, label: 'J.J. Abrams' },
            { count: 72, label: 'Jeffrey Lieber' },
            { count: 69, label: 'Damon Lindelof' },
            { count: 53, label: 'James Manos Jr.' },
            { count: 53, label: 'Jeff Lindsay' }
          ],
          identifier: 'test3',
          label: 'Test 3',
          display: 'ListFacet',
          type: 'RefinementSelectFacet'
        }
      ])
    })
  })

  describe('filterTransform', () => {
    it('should get filter for test', () => {
      const qm = new QueryManager()
      qm.setFilters([{ identifier: 'test', value: 'testValue' }])
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          identifier: 'test',
          label: 'Test',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ field: 'test2', identifier: 'test2', label: 'Test 2' })
      ]
      expect(filterTransform(qm, facetConfig)).toEqual({
        bool: { must: [{ bool: { should: [{ term: { test: 'testValue' } }] } }] }
      })
    })

    it('should get 2 filters for test', () => {
      const qm = new QueryManager()
      qm.setFilters([
        { identifier: 'test', value: 'testValue' },
        { identifier: 'test2', value: 'testValue2' }
      ])
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          identifier: 'test',
          label: 'Test',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ field: 'test2', identifier: 'test2', label: 'Test 2' })
      ]
      expect(filterTransform(qm, facetConfig)).toEqual({
        bool: {
          must: [
            { bool: { should: [{ term: { test: 'testValue' } }] } },
            { bool: { must: [{ term: { test2: 'testValue2' } }] } }
          ]
        }
      })
    })

    it('should get 1 filters for test, missing test 2 facet config is omitted', () => {
      const qm = new QueryManager()
      qm.setFilters([
        { identifier: 'test', value: 'testValue' },
        { identifier: 'test2', value: 'testValue2' }
      ])
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          identifier: 'test',
          label: 'Test',
          multipleSelect: true
        })
      ]
      expect(filterTransform(qm, facetConfig)).toEqual({
        bool: {
          must: [{ bool: { should: [{ term: { test: 'testValue' } }] } }]
        }
      })
    })
  })
})
