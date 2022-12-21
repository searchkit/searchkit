import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'

import nock from 'nock'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Integration tests for query rules', () => {
  const client = Client({
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
      query_rules: [
        {
          conditions: [
            [
              {
                context: 'query',
                match_type: 'exact',
                value: 'shawshank'
              }
            ]
          ],
          actions: [
            {
              action: 'PinnedResult',
              documentIds: ['1']
            },
            {
              action: 'RenderUserData',
              userData: '{"title":"Movies"}'
            },
            {
              action: 'RenderFacetsOrder',
              facetAttributesOrder: ['type', 'actors']
            }
          ]
        },
        {
          conditions: [
            [
              {
                context: 'query',
                match_type: 'exact',
                value: 'movie'
              }
            ]
          ],
          actions: [
            {
              action: 'QueryRewrite',
              query: 'one'
            }
          ]
        }
      ]
    }
  })

  it('call with one filter and query applied', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  it('query rewrite', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.query.bool.must).toMatchInlineSnapshot(`
          {
            "function_score": {
              "functions": [],
              "query": {
                "pinned": {
                  "ids": [],
                  "organic": {
                    "combined_fields": {
                      "fields": [
                        "title",
                        "actors",
                        "query",
                      ],
                      "query": "one",
                    },
                  },
                },
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((x) => {
        return {
          ...x,
          params: {
            ...x.params,
            query: 'movie'
          }
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )
  })
})
