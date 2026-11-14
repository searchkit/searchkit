import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import { NestedQueryRequest } from '../mocks/AlgoliaRequests'
import { ExampleNestedFiltersResponse } from '../mocks/ElasticsearchResponses'

describe('Numeric filters with mixed nested and non-nested attributes', () => {
  const makeClient = () =>
    new Client({
      connection: { host: 'http://localhost:9200', apiKey: 'key' },
      search_settings: {
        search_attributes: ['title'],
        result_attributes: ['title'],
        facet_attributes: [
          { attribute: 'price', field: 'price', type: 'numeric' },
          { attribute: 'size', field: 'size', type: 'numeric', nestedPath: 'variants' }
        ]
      }
    })

  const run = async (numericFilters: string[]) => {
    let body: any
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        body = requestBody
        return true
      })
      .reply(200, {
        ...ExampleNestedFiltersResponse,
        responses: [ExampleNestedFiltersResponse.responses[0]]
      })

    await makeClient().handleInstantSearchRequests([
      {
        ...NestedQueryRequest[0],
        params: { ...NestedQueryRequest[0].params, numericFilters, facetFilters: [] }
      }
    ] as AlgoliaMultipleQueriesQuery[])
    return body
  }

  it.each([[['size>=40', 'price<=20']], [['price<=20', 'size>=40']]])(
    'does not throw for %j and applies both filters',
    async (numericFilters) => {
      const body = await run(numericFilters)
      expect(body).toContain('"nested"')
      expect(body).toContain('variants.size')
      expect(body).toContain('"price"')
    }
  )
})
