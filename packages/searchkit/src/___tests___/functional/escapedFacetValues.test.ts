import Client, { AlgoliaMultipleQueriesQuery } from '../..'
import nock from 'nock'

// searchkit#1425: InstantSearch escapes a leading "-" in a refined facet value as "\-".
// Searchkit must send the unescaped value to Elasticsearch and match query rules against it.
describe('Facet values starting with "-"', () => {
  const client = new Client({
    connection: { host: 'http://localhost:9200' },
    search_settings: {
      search_attributes: ['sensor'],
      result_attributes: ['band', 'sensor'],
      facet_attributes: [
        { attribute: 'band', field: 'band', type: 'string' },
        { attribute: 'reading', field: 'value', nestedPath: 'readings', type: 'string' }
      ],
      query_rules: [
        {
          id: 'below-zero',
          conditions: [
            [{ context: 'filterPresent', values: [{ attribute: 'band', value: '-10 to 0' }] }]
          ],
          actions: [{ action: 'RenderUserData', userData: '{"banner":"cold"}' }]
        }
      ]
    }
  })

  const esResponse = () => ({
    took: 1,
    timed_out: false,
    hits: { total: { value: 2, relation: 'eq' }, max_score: null, hits: [] },
    aggregations: {
      band: {
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
        buckets: [
          { key: '-10 to 0', doc_count: 2 },
          { key: '0 to 10', doc_count: 3 }
        ]
      }
    },
    status: 200
  })

  // captures the query of each search in the _msearch body
  const mockSearch = (queries: any[], searches: number) =>
    nock('http://localhost:9200')
      .post('/_msearch', (body: string) => {
        const lines = body.split('\n').filter(Boolean)
        for (let i = 1; i < lines.length; i += 2) queries.push(JSON.parse(lines[i]).query)
        return true
      })
      .reply(200, { took: 1, responses: Array.from({ length: searches }, esResponse) })

  afterEach(() => nock.cleanAll())

  it('sends the unescaped value for a disjunctive refinement and fires the query rule', async () => {
    const queries: any[] = []
    mockSearch(queries, 2)

    // the two requests InstantSearch sends for a refined disjunctive facet:
    // the results query and the query for the facet's own counts (without its refinement)
    const response = await client.handleInstantSearchRequests([
      {
        indexName: 'temps',
        params: { facets: ['band'], facetFilters: [['band:\\-10 to 0']], query: '' }
      },
      {
        indexName: 'temps',
        params: { facets: ['band'], hitsPerPage: 0, query: '' }
      }
    ] as AlgoliaMultipleQueriesQuery[])

    expect(queries[0].bool.filter).toEqual([{ bool: { should: [{ term: { band: '-10 to 0' } }] } }])
    expect(queries[1].bool.filter).toEqual([])
    expect(JSON.stringify(queries)).not.toContain('\\\\-')

    expect((response.results[0] as any).userData).toEqual([{ banner: 'cold' }])
    expect((response.results[0] as any).facets?.band).toEqual({ '-10 to 0': 2, '0 to 10': 3 })
  })

  it('sends the unescaped value for conjunctive and nested refinements', async () => {
    const queries: any[] = []
    mockSearch(queries, 1)

    const response = await client.handleInstantSearchRequests([
      {
        indexName: 'temps',
        params: {
          facets: ['band'],
          facetFilters: ['band:\\-5', ['reading:\\-0.5', 'reading:1']],
          query: ''
        }
      }
    ] as AlgoliaMultipleQueriesQuery[])

    expect(queries[0].bool.filter).toEqual([
      { term: { band: '-5' } },
      {
        bool: {
          should: [
            {
              nested: {
                inner_hits: {},
                path: 'readings',
                query: {
                  bool: {
                    should: [
                      { term: { 'readings.value': '-0.5' } },
                      { term: { 'readings.value': '1' } }
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ])
    // the rule's condition is "-10 to 0", so a "-5" refinement doesn't fire it
    expect((response.results[0] as any).userData ?? []).toEqual([])
  })
})
