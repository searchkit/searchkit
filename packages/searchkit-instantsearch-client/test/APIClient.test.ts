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
  })
})
