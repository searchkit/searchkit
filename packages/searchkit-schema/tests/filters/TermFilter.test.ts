import nock from 'nock'
import { SearchkitConfig, TermFilter } from '@searchkit/sdk'
import { callQuery, setupTestServer } from '../support/helper'
import HitsMock from '../__mock-data__/HitResolver/Hits.json'

describe('Term Filter', () => {
  const runQuery = async (filters = '') => {
    const gql = `
        {
          results( query: "heat", filters: [${filters}]) {
            summary {
              appliedFilters {
                id
                ... on ValueSelectedFilter {
                  value
                  label
                  display
                }
                ... on NumericRangeSelectedFilter {
                  min
                  max
                  label
                  display
                }
              }
            }
          }
        }
      `
    const response = await callQuery({ gql })
    return response
  }

  describe('TermFilter', () => {
    it('should apply filter', async () => {
      const moviesSearchConfig: SearchkitConfig = {
        host: 'http://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers']
        },
        filters: [
          new TermFilter({
            identifier: 'type',
            field: 'type',
            label: 'type'
          })
        ]
      }

      setupTestServer({
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit',
        config: moviesSearchConfig,
        addToQueryType: true
      })

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {},
              "from": 0,
              "query": Object {
                "bool": Object {
                  "filter": Array [
                    Object {
                      "bool": Object {
                        "filter": Array [
                          Object {
                            "term": Object {
                              "type": "movie",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              "size": 0,
              "sort": Array [
                Object {
                  "_score": "desc",
                },
              ],
            }
          `)
          return [200, HitsMock]
        })

      const response = await runQuery('{ identifier: "type", value: "movie" }')
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "results": Object {
              "summary": Object {
                "appliedFilters": Array [
                  Object {
                    "display": "TermFilter",
                    "id": "type_movie",
                    "label": "type",
                    "value": "movie",
                  },
                ],
              },
            },
          },
        }
      `)
    })
  })
})
