import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Debugging Support', () => {
  it('should emit the elasticsearch query to console with debug mode', async () => {
    const client = new Client(
      {
        connection: {
          host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
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
          ],
          filter_attributes: [{ field: 'imdbrating', attribute: 'imdbrating', type: 'numeric' }]
        }
      },
      { debug: true }
    )

    console.log = jest.fn()

    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(console.log).toHaveBeenCalledTimes(3)
    const x = (console.log as jest.Mock).mock.calls[2][0]
    expect(x).toMatchSnapshot('ES Request logging')
  })
})
