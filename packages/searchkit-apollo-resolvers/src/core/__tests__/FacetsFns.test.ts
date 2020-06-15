import { SearchResponse } from 'elasticsearch'
import { filterTransform, getAggregationsFromFacets, getFacetsFromResponse } from '../FacetsFns'
import QueryManager from '../QueryManager'
import { RefinementSelectFacet } from '../../facets'

describe('Facet Fns', () => {
  describe('getAggregationsFromFacets', () => {
    it('create aggregations for one facet ', () => {
      const qm = new QueryManager([{ id: 'test', value: 'testValue' }], '')
      const facetConfig = [new RefinementSelectFacet({ field: 'test', id: 'test', label: 'Test' })]

      expect(getAggregationsFromFacets(qm, {}, facetConfig)).toEqual({
        aggs: {
          facet_bucket_all: {
            aggs: { test: { terms: { field: 'test', size: 5 } } },
            filter: { bool: { must: [{ bool: { must: [{ term: { test: 'testValue' } }] } }] } }
          }
        }
      })
    })

    it('create aggregations for two facets in all and one for Multiple select', () => {
      const qm = new QueryManager(
        [
          { id: 'test', value: 'testValue' },
          { id: 'test3', value: 'testValue' }
        ],
        ''
      )
      const facetConfig = [
        new RefinementSelectFacet({ field: 'test', id: 'test', label: 'Test' }),
        new RefinementSelectFacet({ field: 'test2', id: 'test2', label: 'Test 2' }),
        new RefinementSelectFacet({
          field: 'test3',
          id: 'test3',
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
      const response: SearchResponse<any> = {
        took: 0,
        timed_out: false,
        hits: {
          hits: [],
          max_score: 0,
          total: 0
        },
        _shards: {
          total: 0,
          failed: 0,
          skipped: 0,
          successful: 0
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
        new RefinementSelectFacet({ field: 'test', id: 'test', label: 'Test 1' }),
        new RefinementSelectFacet({ field: 'test2', id: 'test2', label: 'Test 2' }),
        new RefinementSelectFacet({
          field: 'test3',
          id: 'test3',
          label: 'Test 3',
          multipleSelect: true
        })
      ]
      expect(getFacetsFromResponse(facetConfig, response)).toEqual([
        {
          entries: [
            { count: 73, id: 'test_TV-14', label: 'TV-14' },
            { count: 7, id: 'test_TV-PG', label: 'TV-PG' },
            { count: 2, id: 'test_PG', label: 'PG' },
            { count: 2, id: 'test_PG-13', label: 'PG-13' }
          ],
          id: 'test',
          label: 'Test 1',
          display: 'List',
          type: 'RefinementSelectFacet'
        },
        {
          entries: [
            { count: 73, id: 'test2_Naveen Andrews', label: 'Naveen Andrews' },
            { count: 53, id: 'test2_Emilie de Ravin', label: 'Emilie de Ravin' },
            { count: 39, id: 'test2_Henry Ian Cusick', label: 'Henry Ian Cusick' },
            { count: 34, id: 'test2_Matthew Fox', label: 'Matthew Fox' },
            { count: 23, id: 'test2_Michael Emerson', label: 'Michael Emerson' }
          ],
          id: 'test2',
          label: 'Test 2',
          display: 'List',
          type: 'RefinementSelectFacet'
        },
        {
          entries: [
            { count: 78, id: 'test3_J.J. Abrams', label: 'J.J. Abrams' },
            { count: 72, id: 'test3_Jeffrey Lieber', label: 'Jeffrey Lieber' },
            { count: 69, id: 'test3_Damon Lindelof', label: 'Damon Lindelof' },
            { count: 53, id: 'test3_James Manos Jr.', label: 'James Manos Jr.' },
            { count: 53, id: 'test3_Jeff Lindsay', label: 'Jeff Lindsay' }
          ],
          id: 'test3',
          label: 'Test 3',
          display: 'List',
          type: 'RefinementSelectFacet'
        }
      ])
    })
  })

  describe('filterTransform', () => {
    it('should get filter for test', () => {
      const qm = new QueryManager([{ id: 'test', value: 'testValue' }], '')
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          id: 'test',
          label: 'Test',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ field: 'test2', id: 'test2', label: 'Test 2' })
      ]
      expect(filterTransform(qm, facetConfig)).toEqual({
        bool: { must: [{ bool: { should: [{ term: { test: 'testValue' } }] } }] }
      })
    })

    it('should get 2 filters for test', () => {
      const qm = new QueryManager(
        [
          { id: 'test', value: 'testValue' },
          { id: 'test2', value: 'testValue2' }
        ],
        ''
      )
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          id: 'test',
          label: 'Test',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ field: 'test2', id: 'test2', label: 'Test 2' })
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
      const qm = new QueryManager(
        [
          { id: 'test', value: 'testValue' },
          { id: 'test2', value: 'testValue2' }
        ],
        ''
      )
      const facetConfig = [
        new RefinementSelectFacet({
          field: 'test',
          id: 'test',
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
