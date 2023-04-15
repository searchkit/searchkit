import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Integration tests for Snippet Attributes', () => {
  const config = {
    connection: {
      host: 'http://localhost:9200',
      apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    search_settings: {
      search_attributes: ['title', 'actors', 'query'],
      result_attributes: ['title', 'actors', 'query'],
      snippet_attributes: ['description:200', 'actors']
    }
  }

  it('should have custom snippet for description', async () => {
    const client = new Client(config as unknown as any)
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.highlight.fields).toMatchInlineSnapshot(`
          {
            "actors": {
              "fragment_size": 100,
              "number_of_fragments": 5,
            },
            "description": {
              "fragment_size": 200,
              "number_of_fragments": 5,
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((r) => {
        return {
          ...r,
          params: {
            ...r.params,
            facets: [],
            facetFilters: []
          }
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toBeTruthy()
  })
})
