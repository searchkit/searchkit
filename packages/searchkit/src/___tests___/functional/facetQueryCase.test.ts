import Client, { AlgoliaMultipleQueriesQuery } from '../..'
import nock from 'nock'

// https://github.com/searchkit/searchkit/issues/1378
describe('facetQuery case insensitivity', () => {
  const client = new Client({
    connection: { host: 'http://localhost:9200' },
    search_settings: {
      search_attributes: ['title'],
      result_attributes: ['title'],
      facet_attributes: [{ attribute: 'brand', field: 'brand.keyword', type: 'string' }]
    }
  })

  const facetSearchRequest = (facetQuery: string) =>
    [
      {
        indexName: 'products',
        params: {
          facetName: 'brand',
          facetQuery,
          facets: ['brand'],
          highlightPostTag: '</ais-highlight-0000000000>',
          highlightPreTag: '<ais-highlight-0000000000>',
          maxFacetHits: 10,
          page: 0,
          query: ''
        }
      }
    ] as unknown as AlgoliaMultipleQueriesQuery[]

  const esResponse = {
    took: 1,
    responses: [
      {
        took: 1,
        timed_out: false,
        hits: { total: { value: 1, relation: 'eq' }, max_score: 1, hits: [] },
        aggregations: {
          brand: {
            doc_count_error_upper_bound: 0,
            sum_other_doc_count: 0,
            buckets: [{ key: 'Mario Kart', doc_count: 3 }]
          }
        },
        status: 200
      }
    ]
  }

  afterEach(() => nock.cleanAll())

  it.each([
    ['mario', '([a-zA-Z]+ )+?[mM][aA][rR][iI][oO].*'],
    ['Mario', '([a-zA-Z]+ )+?[mM][aA][rR][iI][oO].*'],
    ['MARIO', '([a-zA-Z]+ )+?[mM][aA][rR][iI][oO].*'],
    ['mA', '[mM][aA].*']
  ])('facetQuery %p produces a case insensitive include regex', async (facetQuery, expected) => {
    let include: string | undefined
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const body = JSON.parse(requestBody.split('\n')[1])
        include = body.aggs.brand.terms.include
        return true
      })
      .reply(200, esResponse)

    const response = await client.handleInstantSearchRequests(facetSearchRequest(facetQuery))

    // matching against real (mixed case) values is covered by e2e/tests/facets.spec.ts;
    // the regex uses Lucene syntax so it can't be checked with a JS RegExp
    expect(include).toBe(expected)
    expect((response.results[0] as any).facetHits).toEqual([
      expect.objectContaining({ value: 'Mario Kart', count: 3 })
    ])
  })
})
