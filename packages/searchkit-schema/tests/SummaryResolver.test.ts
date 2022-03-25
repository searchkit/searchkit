import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { MultiMatchQuery } from '@searchkit/sdk'
import { RangeFacet, RefinementSelectFacet, DateRangeFacet } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'

describe('Summary Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors']
      },
      sortOptions: [
        { id: 'relevance', label: 'Relevance', field: '_score' },
        { id: 'released', label: 'Recent Releases', field: { released: 'desc' } }
      ],
      query: new MultiMatchQuery({ fields: ['actors', 'title^4', 'plot'] }),
      facets: [
        new RefinementSelectFacet({
          identifier: 'actors',
          field: 'actors.keyword',
          label: 'Actors'
        }),
        new RefinementSelectFacet({ identifier: 'type', field: 'type', label: 'Type' }),
        new RefinementSelectFacet({
          identifier: 'genres',
          field: 'genres.keyword',
          label: 'Genres'
        }),
        new RangeFacet({
          identifier: 'imdbrating',
          field: 'imdbrating',
          label: 'IMDB Rating',
          range: {
            interval: 10,
            max: 100,
            min: 0
          }
        }),
        new DateRangeFacet({ identifier: 'released', field: 'released', label: 'Release' })
      ]
    }

    it('should return correct summary', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [
            { identifier: "actors", value: "Jeff Lindsay" },
            { identifier: "imdbrating", min: 0, max: 50 },
            { identifier: "released", dateMin: "2012-12-18T00:00:00.000Z", dateMax: "2020-12-18T00:00:00.000Z" }
          ]) {
            summary {
              total
              appliedFilters {
                id
                identifier
                label
                display
                ... on DateRangeSelectedFilter {
                  dateMin
                  dateMax
                }

                ... on NumericRangeSelectedFilter {
                  min
                  max
                }

                ... on ValueSelectedFilter {
                  value
                }
              }
              sortOptions {
                id
                label
              }
              query
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
              page {
                total
                totalPages
                pageNumber
                from
                size
              }
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_source": Object {
                "includes": Array [
                  "actors",
                ],
              },
              "aggs": Object {},
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "actors.keyword": "Jeff Lindsay",
                            },
                          },
                        ],
                      },
                    },
                    Object {
                      "range": Object {
                        "imdbrating": Object {
                          "gte": 0,
                          "lte": 50,
                        },
                      },
                    },
                    Object {
                      "range": Object {
                        "released": Object {
                          "gte": "2012-12-18T00:00:00.000Z",
                          "lte": "2020-12-18T00:00:00.000Z",
                        },
                      },
                    },
                  ],
                },
              },
              "size": 10,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, HitsMock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
