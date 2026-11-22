import nock from 'nock'
import Client, {
  AlgoliaMultipleQueriesQuery,
  ElasticsearchAdapter,
  SearchAdapter,
  SearchkitConfig
} from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

const search_settings: SearchkitConfig['search_settings'] = {
  highlight_attributes: ['title', 'actors'],
  search_attributes: ['title', 'actors', 'query'],
  result_attributes: ['title', 'actors', 'query'],
  facet_attributes: [
    'type',
    { field: 'actors.keyword', attribute: 'actors', type: 'string' },
    'rated'
  ],
  query_rules: [
    {
      id: 'rule',
      conditions: [[{ context: 'query', value: 'shawshank', match_type: 'exact' }]],
      actions: [{ action: 'QueryFilter', query: 'type:movie' }]
    }
  ]
}

const requests = DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]

describe('adapters', () => {
  it('sends the same Elasticsearch request with `adapter: ElasticsearchAdapter(...)` as with `connection`', async () => {
    const bodies: string[] = []
    nock('http://localhost:9200')
      .post('/_msearch', (body: any) => {
        bodies.push(body)
        return true
      })
      .times(2)
      .reply(200, HitsResponseWithFacetFilter)

    const connection = { host: 'http://localhost:9200' }
    const viaConnection = await new Client({
      connection,
      search_settings
    }).handleInstantSearchRequests(requests)
    const viaAdapter = await new Client({
      adapter: ElasticsearchAdapter(connection),
      search_settings
    }).handleInstantSearchRequests(requests)

    expect(bodies).toHaveLength(2)
    expect(bodies[1]).toEqual(bodies[0])
    expect(viaAdapter).toEqual(viaConnection)
  })

  it('accepts a custom transporter in ElasticsearchAdapter, like connection', async () => {
    const msearch = jest.fn(async () => [
      HitsResponseWithFacetFilter.responses[0],
      HitsResponseWithFacetFilter.responses[1]
    ])
    const client = new Client({
      adapter: ElasticsearchAdapter({ msearch } as any),
      search_settings
    })
    await client.handleInstantSearchRequests(requests)
    expect(msearch).toHaveBeenCalledTimes(1)
    expect((msearch.mock.calls[0] as any)[0][0].indexName).toBe('imdb_movies')
  })

  it('uses the adapter over the connection, passing the query rule actions and request options', async () => {
    const adapter: SearchAdapter<{ id: number }, { hits: string[] }> = {
      name: 'custom',
      buildRequest: jest.fn((request, settings, rules) => ({ id: rules.filters.length })),
      execute: jest.fn(async (requests) => requests.map((r) => ({ hits: [`hit-${r.id}`] }))),
      transformResponse: jest.fn((response, request) => ({
        hits: response.hits.map((objectID) => ({ objectID })),
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        nbHits: 1,
        exhaustiveNbHits: true,
        query: '',
        index: request.indexName,
        params: ''
      })),
      transformFacetValuesResponse: jest.fn(() => ({
        facetHits: [],
        exhaustiveFacetsCount: true
      }))
    }
    const beforeSearch = jest.fn(async (r: any) => r)
    const afterSearch = jest.fn(async (r: any, responses: any) => responses)
    const getQuery = jest.fn()

    const client = new Client({
      adapter,
      // ignored: adapter wins
      connection: { host: 'http://localhost:1' },
      search_settings
    })

    const response = await client.handleInstantSearchRequests(
      [
        { indexName: 'movies', params: { query: 'shawshank' } },
        { indexName: 'movies', params: { facetName: 'type', facetQuery: '' } }
      ],
      { getQuery, hooks: { beforeSearch, afterSearch } }
    )

    expect(adapter.buildRequest).toHaveBeenCalledTimes(2)
    const [request, settings, rules, options] = (adapter.buildRequest as jest.Mock).mock.calls[0]
    expect(request).toEqual({ indexName: 'movies', params: { query: 'shawshank' } })
    expect(settings).toBe(search_settings)
    expect(rules).toMatchObject({ ruleIds: ['rule'], filters: ['type:movie'], query: 'shawshank' })
    expect(options.getQuery).toBe(getQuery)

    expect(beforeSearch).toHaveBeenCalledWith([{ id: 1 }, { id: 0 }])
    expect(adapter.execute).toHaveBeenCalledWith([{ id: 1 }, { id: 0 }], { debug: false })
    expect(afterSearch).toHaveBeenCalledWith(
      [{ id: 1 }, { id: 0 }],
      [{ hits: ['hit-1'] }, { hits: ['hit-0'] }]
    )
    expect(adapter.transformResponse).toHaveBeenCalledTimes(1)
    expect(adapter.transformFacetValuesResponse).toHaveBeenCalledTimes(1)
    expect(response.results).toEqual([
      expect.objectContaining({ hits: [{ objectID: 'hit-1' }], index: 'movies' }),
      { facetHits: [], exhaustiveFacetsCount: true }
    ])
  })

  it('throws when there is neither an adapter nor a connection', () => {
    expect(() => new Client({ search_settings } as SearchkitConfig)).toThrow(
      'No adapter or connection provided'
    )
  })
})
