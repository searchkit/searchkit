import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import { NestedQueryRequest } from '../mocks/AlgoliaRequests'
import { ExampleNestedFiltersResponse } from '../mocks/ElasticsearchResponses'

describe('Nested Filters', () => {
  it('Numeric nested filter with 2 numeric filters', async () => {
    const client = new Client({
      connection: {
        host: 'http://localhost:9200',
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
      },
      search_settings: {
        highlight_attributes: ['title'],
        search_attributes: ['title'],
        result_attributes: ['title'],
        facet_attributes: [
          {
            attribute: 'user.price',
            field: 'price',
            type: 'numeric',
            nestedPath: 'user'
          }
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        return true
      })
      .reply(200, {
        ...ExampleNestedFiltersResponse,
        responses: [ExampleNestedFiltersResponse.responses[0]]
      })

    const response = await client.handleInstantSearchRequests([
      {
        ...NestedQueryRequest[0],
        params: {
          ...NestedQueryRequest[0].params,
          numericFilters: ['user.price>=40', 'user.price<=140'],
          facetFilters: []
        }
      }
    ] as AlgoliaMultipleQueriesQuery[])

    expect(response).toMatchSnapshot()
  })
})
