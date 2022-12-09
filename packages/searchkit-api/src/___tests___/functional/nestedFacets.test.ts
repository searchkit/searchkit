import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import {
  DisjunctiveExampleRequest,
  NestedQueryRequest,
  TwoFiltersNestedQueryRequest
} from '../mocks/AlgoliaRequests'
import {
  ExampleNestedFiltersResponse,
  HitsResponseWithFacetFilter
} from '../mocks/ElasticsearchResponses'

fdescribe('Nested Facets, filters and results', () => {
  it('One nested facet support', async () => {
    const client = Client({
      connection: {
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
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

    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
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
              "must": [],
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

  it('two OR filters', async () => {
    const client = Client({
      connection: {
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
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

    nock('https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243')
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
              "must": [],
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
})
