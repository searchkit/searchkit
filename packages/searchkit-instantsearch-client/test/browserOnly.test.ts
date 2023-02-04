import Searchkit, { SearchkitConfig } from 'searchkit'
import FrontendClient from '../src/index'
import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../../searchkit/src/___tests___/mocks/ElasticsearchResponses'
import { DisjunctiveExampleRequest } from '../../searchkit/src/___tests___/mocks/AlgoliaRequests'
import 'cross-fetch/polyfill'

describe('Browser Only Searchkit', () => {
  it('works as expected', async () => {
    const config: SearchkitConfig = {
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title', 'actors'],
        search_attributes: ['title', 'actors', 'query'],
        result_attributes: ['title', 'actors', 'query'],
        facet_attributes: [
          'type',
          { field: 'actors.keyword', attribute: 'actors', type: 'string' },
          'rated'
        ]
      }
    }

    const client = new Searchkit(config)

    const x = FrontendClient(client)

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        return requestBody
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await x.search(DisjunctiveExampleRequest as any)

    expect(response).toMatchSnapshot()
    // @ts-ignore
    expect(Object.keys(x.cache)).toMatchInlineSnapshot(`
      [
        "[{"indexName":"imdb_movies","params":{"facetFilters":[["type:movie"]],"facets":["*"],"highlightPostTag":"</em>","highlightPreTag":"<em>","maxValuesPerFacet":10,"page":0,"query":"shawshank","tagFilters":""}},{"indexName":"imdb_movies","params":{"analytics":false,"attributesToHighlight":[],"attributesToRetrieve":[],"attributesToSnippet":[],"clickAnalytics":false,"facets":"type","highlightPostTag":"</em>","highlightPreTag":"<em>","hitsPerPage":1,"maxValuesPerFacet":10,"page":0,"query":"shawshank","tagFilters":""}}]",
      ]
    `)
    x.clearCache()
    // @ts-ignore
    expect(x.cache).toEqual({})
  })

  it('request options', async () => {
    const config: SearchkitConfig = {
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title', 'actors'],
        search_attributes: ['title', 'actors', 'query'],
        result_attributes: ['title', 'actors', 'query'],
        facet_attributes: [
          'type',
          { field: 'actors.keyword', attribute: 'actors', type: 'string' },
          'rated'
        ]
      }
    }

    const client = new Searchkit(config)

    const x = FrontendClient(client, {
      getQuery(query, search_attributes, config) {
        return {
          combined_fields: {
            query: query,
            fields: search_attributes.map((attr) => (typeof attr === 'string' ? attr : attr.field))
          }
        }
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request with overriden query with combined_fields')
        return requestBody
      })
      .reply(200, HitsResponseWithFacetFilter)

    await x.search(DisjunctiveExampleRequest as any)
  })
})
