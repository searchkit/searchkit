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
          id: '1',
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
          id: '2',
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
        },
        {
          id: '3',
          conditions: [
            [
              {
                context: 'query',
                match_type: 'exact',
                value: 'testQuery'
              }
            ]
          ],
          actions: [
            {
              action: 'QueryFilter',
              query: 'actors:Actor1 OR rated:[4 TO *]'
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
                    "bool": {
                      "should": [
                        {
                          "bool": {
                            "should": [
                              {
                                "multi_match": {
                                  "fields": [
                                    "title",
                                    "actors",
                                    "query",
                                  ],
                                  "fuzziness": "AUTO:4,8",
                                  "query": "one",
                                },
                              },
                              {
                                "multi_match": {
                                  "fields": [
                                    "title",
                                    "actors",
                                    "query",
                                  ],
                                  "query": "one",
                                  "type": "bool_prefix",
                                },
                              },
                            ],
                          },
                        },
                        {
                          "multi_match": {
                            "fields": [
                              "title",
                              "actors",
                              "query",
                            ],
                            "query": "one",
                            "type": "phrase",
                          },
                        },
                      ],
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

  it('Query Filters', async () => {
    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
      .post('/_msearch', (requestBody: any) => {
        const x = JSON.parse(requestBody.split('\n')[1])
        expect(x.query.bool.filter).toMatchInlineSnapshot(`
          [
            {
              "bool": {
                "should": [
                  {
                    "term": {
                      "type": "movie",
                    },
                  },
                ],
              },
            },
            {
              "query_string": {
                "query": "actors.keyword:Actor1 OR rated:[4 TO *]",
              },
            },
          ]
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
            query: 'testQuery'
          }
        }
      }) as AlgoliaMultipleQueriesQuery[]
    )
  })
})
