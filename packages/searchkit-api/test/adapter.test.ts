import Client, { ElasticsearchAdapter, SearchAdapter } from '@searchkit/api'

const search_settings = {
  search_attributes: ['title'],
  result_attributes: ['title']
}

describe('adapter', () => {
  it('re-exports the Elasticsearch adapter', () => {
    expect(ElasticsearchAdapter({ host: 'http://localhost:9200' }).name).toBe('elasticsearch')
  })

  it('passes the adapter through to Searchkit', async () => {
    const adapter: SearchAdapter<string, string[]> = {
      name: 'custom',
      buildRequest: (request) => request.indexName,
      execute: async (requests) => requests.map((indexName) => [`${indexName}-hit`]),
      transformResponse: (response, request) => ({
        hits: response.map((objectID) => ({ objectID })),
        hitsPerPage: 20,
        page: 0,
        nbPages: 1,
        exhaustiveNbHits: true,
        query: '',
        index: request.indexName,
        params: ''
      }),
      transformFacetValuesResponse: () => ({ facetHits: [], exhaustiveFacetsCount: true })
    }

    const client = Client({ adapter, search_settings })
    const response = await client.handleRequest([{ indexName: 'movies', params: { query: 'x' } }])

    expect(response.results).toEqual([
      expect.objectContaining({ index: 'movies', hits: [{ objectID: 'movies-hit' }] })
    ])
  })
})
