import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import {
  NestedQueryRequest,
  NumericFilterNestedQueryRequest,
  TwoFiltersNestedQueryRequest
} from '../mocks/AlgoliaRequests'
import {
  ExampleNestedFiltersResponse,
  ExampleNestedMixedFacetResponse,
  ExampleNestedNumericFilterResponse
} from '../mocks/ElasticsearchResponses'

describe('Nested Facets, filters and results', () => {
  it('One nested facet support', async () => {
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
            attribute: 'user.first',
            field: 'first.keyword',
            type: 'string',
            nestedPath: 'user'
          }
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "user.": {
              "aggs": {
                "user.first": {
                  "terms": {
                    "field": "user.first.keyword",
                    "size": 10,
                  },
                },
              },
              "nested": {
                "path": "user",
              },
            },
          }
        `)

        // has the nested filter applied
        expect(x.query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "bool": {
                    "should": [
                      {
                        "nested": {
                          "inner_hits": {},
                          "path": "user",
                          "query": {
                            "bool": {
                              "should": [
                                {
                                  "term": {
                                    "user.first.keyword": "Alice",
                                  },
                                },
                              ],
                            },
                          },
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
      .reply(200, ExampleNestedFiltersResponse)

    const response = await client.handleInstantSearchRequests(
      NestedQueryRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  it('one facet and two OR filters', async () => {
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
            attribute: 'user.first',
            field: 'first.keyword',
            type: 'string',
            nestedPath: 'user'
          }
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "user.": {
              "aggs": {
                "user.first": {
                  "terms": {
                    "field": "user.first.keyword",
                    "size": 10,
                  },
                },
              },
              "nested": {
                "path": "user",
              },
            },
          }
        `)

        // has the nested filter applied
        expect(x.query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "bool": {
                    "should": [
                      {
                        "nested": {
                          "inner_hits": {},
                          "path": "user",
                          "query": {
                            "bool": {
                              "should": [
                                {
                                  "term": {
                                    "user.first.keyword": "Alice",
                                  },
                                },
                                {
                                  "term": {
                                    "user.first.keyword": "John",
                                  },
                                },
                              ],
                            },
                          },
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
      .reply(200, ExampleNestedFiltersResponse)

    const response = await client.handleInstantSearchRequests(
      TwoFiltersNestedQueryRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  it('one numeric facet', async () => {
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

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "user.": {
              "aggs": {
                "user.price$_entries": {
                  "terms": {
                    "field": "user.price",
                    "size": 10,
                  },
                },
                "user.price$_stats": {
                  "stats": {
                    "field": "user.price",
                  },
                },
              },
              "nested": {
                "path": "user",
              },
            },
          }
        `)

        // has the nested filter applied
        expect(x.query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "nested": {
                    "inner_hits": {},
                    "path": "user",
                    "query": {
                      "bool": {
                        "filter": [
                          {
                            "range": {
                              "user.price": {
                                "gte": "90",
                              },
                            },
                          },
                        ],
                      },
                    },
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
      .reply(200, ExampleNestedNumericFilterResponse)

    const response = await client.handleInstantSearchRequests(
      NumericFilterNestedQueryRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })

  it('two nested facets', async () => {
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
          },
          {
            attribute: 'user.first',
            field: 'first.keyword',
            type: 'string',
            nestedPath: 'user'
          }
        ]
      }
    })

    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1])

        expect(x.aggs).toMatchInlineSnapshot(`
          {
            "user.": {
              "aggs": {
                "user.first": {
                  "terms": {
                    "field": "user.first.keyword",
                    "size": 10,
                  },
                },
                "user.price$_entries": {
                  "terms": {
                    "field": "user.price",
                    "size": 10,
                  },
                },
                "user.price$_stats": {
                  "stats": {
                    "field": "user.price",
                  },
                },
              },
              "nested": {
                "path": "user",
              },
            },
          }
        `)

        // has the nested filter applied
        expect(x.query).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "nested": {
                    "inner_hits": {},
                    "path": "user",
                    "query": {
                      "bool": {
                        "filter": [
                          {
                            "range": {
                              "user.price": {
                                "gte": "90",
                              },
                            },
                          },
                        ],
                      },
                    },
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
      .reply(200, ExampleNestedMixedFacetResponse)

    const response = await client.handleInstantSearchRequests(
      NumericFilterNestedQueryRequest as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
