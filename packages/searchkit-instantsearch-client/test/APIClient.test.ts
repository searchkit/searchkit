import FrontendClient from '../src/index'
import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../../searchkit/src/___tests___/mocks/ElasticsearchResponses'
import { DisjunctiveExampleRequest } from '../../searchkit/src/___tests___/mocks/AlgoliaRequests'
import 'cross-fetch/polyfill'

describe('API connector', () => {
  it('works as expected', async () => {
    const x = FrontendClient({
      url: 'http://localhost:3000/api/search'
    })

    nock('http://localhost:3000/')
      .post('/api/search', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('Algolia request')
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
})
