import nock from 'nock'
import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('KNNSearch', () => {
  it('should return results', async () => {
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

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).knn
        expect(x).toMatchInlineSnapshot(`
          {
            "field": "dense-vector-field",
            "filter": [
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
            ],
            "k": 10,
            "num_candidates": 100,
            "query_vector_builder": {
              "text_embedding": {
                "model_id": "cookie_model",
                "model_text": "shawshank",
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[],
      {
        getKnnQuery(query, search_attributes, config) {
          return {
            field: 'dense-vector-field',
            k: 10,
            num_candidates: 100,
            query_vector_builder: {
              text_embedding: {
                model_id: 'cookie_model',
                model_text: query
              }
            }
          }
        }
      }
    )

    expect(response).toBeTruthy()
  })

  it('should match all + filters with bm25 when theres no query', async () => {
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

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).knn
        const query = JSON.parse(requestBody.split('\n')[1]).query
        expect(x).toMatchInlineSnapshot(`undefined`)
        expect(query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
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
              ],
              "must": {
                "match_all": {},
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const request = [
      {
        ...DisjunctiveExampleRequest[0],
        params: {
          ...DisjunctiveExampleRequest[0].params,
          query: ''
        }
      },
      {
        ...DisjunctiveExampleRequest[1],
        params: {
          ...DisjunctiveExampleRequest[1].params,
          query: ''
        }
      }
    ] as AlgoliaMultipleQueriesQuery[]

    const response = await client.handleInstantSearchRequests(request, {
      getQuery: () => false,
      getKnnQuery(query, search_attributes, config) {
        return {
          field: 'dense-vector-field',
          k: 10,
          num_candidates: 100,
          query_vector_builder: {
            text_embedding: {
              model_id: 'cookie_model',
              model_text: query
            }
          }
        }
      }
    })

    expect(response).toBeTruthy()
  })

  it('should enable hybrid (KNN + BM25)', async () => {
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

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).knn
        const query = JSON.parse(requestBody.split('\n')[1]).query
        expect(x).toMatchInlineSnapshot(`
          {
            "field": "dense-vector-field",
            "filter": [
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
            ],
            "k": 10,
            "num_candidates": 100,
            "query_vector_builder": {
              "text_embedding": {
                "model_id": "cookie_model",
                "model_text": "shawshank",
              },
            },
          }
        `)
        expect(query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
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
              ],
              "must": {
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
                              "query": "shawshank",
                            },
                          },
                          {
                            "multi_match": {
                              "fields": [
                                "title",
                                "actors",
                                "query",
                              ],
                              "query": "shawshank",
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
                        "query": "shawshank",
                        "type": "phrase",
                      },
                    },
                  ],
                },
              },
            },
          }
        `)
        return true
      })
      .reply(200, HitsResponseWithFacetFilter)

    const request = DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]

    const response = await client.handleInstantSearchRequests(request, {
      getKnnQuery(query, search_attributes, config) {
        return {
          field: 'dense-vector-field',
          k: 10,
          num_candidates: 100,
          query_vector_builder: {
            text_embedding: {
              model_id: 'cookie_model',
              model_text: query
            }
          }
        }
      }
    })

    expect(response).toBeTruthy()
  })
})
