import Client, { AlgoliaMultipleQueriesQuery } from '../../'
import nock from 'nock'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import { HitsResponseWithFacetFilter } from '../mocks/ElasticsearchResponses'

describe('Add additional base filters to search', () => {
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
      ],
      filter_attributes: [
        { field: 'imdbrating', attribute: 'imdbrating', type: 'numeric' },
        { field: 'writers', attribute: 'writers', type: 'string' }
      ]
    }
  })

  it('call with one filter and query applied', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
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
                {
                  "query_string": {
                    "query": "imdbrating:>=1 AND type:movie",
                  },
                },
                {
                  "bool": {
                    "must": {
                      "range": {
                        "imdbrating": {
                          "gte": 1,
                        },
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
      .reply(200, HitsResponseWithFacetFilter)

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((request) => ({
        indexName: request.indexName,
        params: {
          ...request.params,
          filters: 'imdbrating:>=1 AND type:movie',

          query: ''
        }
      })) as AlgoliaMultipleQueriesQuery[],
      {
        getBaseFilters: () => {
          return [
            {
              bool: {
                must: {
                  range: {
                    imdbrating: {
                      gte: 1
                    }
                  }
                }
              }
            }
          ]
        }
      }
    )

    expect(response).toMatchSnapshot()
  })

  it('filters not being facets', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        expect(requestBody).toMatchSnapshot('ES Request')
        const x = JSON.parse(requestBody.split('\n')[1]).query
        // has the base filter applied in addition to the facet filter
        expect(x).toMatchInlineSnapshot(`
          {
            "bool": {
              "filter": [
                {
                  "term": {
                    "writers": "Quentin Tarantino",
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

    const response = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest.map((request) => ({
        indexName: request.indexName,
        params: {
          ...request.params,
          facets: ['writers'],
          facetFilters: ['writers:Quentin Tarantino'],
          query: ''
        }
      })) as AlgoliaMultipleQueriesQuery[]
    )

    expect(response).toMatchSnapshot()
  })
})
