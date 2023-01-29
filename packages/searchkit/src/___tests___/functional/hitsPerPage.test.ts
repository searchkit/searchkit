import Client from '../../'
import {
  DisjunctiveExampleRequest,
  nonDynamicFacetRequest,
  nonDynamicFacetRequestOneFilter,
  NumericFiltersExampleRequest
} from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Hits Per Page', () => {
  const client = new Client({
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
  })

  it('should return the default 20 for UI request', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const uiRequest = JSON.parse(requestBody.split('\n')[1])
        const filterRequest = JSON.parse(requestBody.split('\n')[3])
        expect(uiRequest.size).toBe(20)
        expect(filterRequest.size).toBe(0)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests([
      DisjunctiveExampleRequest[0],
      {
        ...DisjunctiveExampleRequest[1],
        params: {
          ...DisjunctiveExampleRequest[1].params,
          hitsPerPage: 0
        }
      }
    ] as AlgoliaMultipleQueriesQuery[])

    expect(response).toMatchSnapshot()
  })
})
