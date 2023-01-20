import Client, { AlgoliaMultipleQueriesQuery, SearchRequest } from '../../'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

const client = new Client({
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
    ]
  }
})

describe('Hooks', () => {
  it('beforeSearch & afterSearch Hooks', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.knn).toMatchInlineSnapshot(`
          {
            "field": "query-vector",
            "k": 10,
            "num_candidates": 100,
            "query_vector": [
              -5,
              9,
              -12,
            ],
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const beforeSearchHook = jest.fn().mockImplementation(async (requests) => {
      const uiRequest = requests[0] as SearchRequest

      uiRequest.body.knn = {
        field: 'query-vector',
        query_vector: [-5, 9, -12],
        k: 10,
        num_candidates: 100
      }

      return requests
    })

    const afterSearchHook = jest.fn().mockImplementation(async (requests, responses) => {
      return responses
    })

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[],
      {
        hooks: {
          beforeSearch: beforeSearchHook,
          afterSearch: afterSearchHook
        }
      }
    )

    expect(beforeSearchHook).toHaveBeenCalledTimes(1)
    expect(afterSearchHook).toHaveBeenCalledTimes(1)

    expect(response).toMatchSnapshot()
  })
})
