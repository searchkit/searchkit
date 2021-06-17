import nock from 'nock'
import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery, VisibleWhen, FacetSelectedRule } from '../src'
import { RefinementSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/FacetsResolver/results.json'
import QueryManager from '../src/core/QueryManager'

describe('Facets Resolver', () => {
  let customRule = jest.fn((queryManager: QueryManager, ctx: any) => {
    return true
  })
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [
        new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
        VisibleWhen(
          [
            new RefinementSelectFacet({
              identifier: 'writers',
              field: 'writers.raw',
              label: 'Writers',
              display: 'override',
              multipleSelect: true
            }),
            new RefinementSelectFacet({
              identifier: 'actors',
              field: 'actors.raw',
              label: 'Actors'
            }),
            new RefinementSelectFacet({
              identifier: 'genres',
              field: 'genres.raw',
              label: 'Genres'
            })
          ],
          [
            FacetSelectedRule('type', 'Movie'),
            customRule
          ]
        )
      ]
    }

    it('should return correct Results', async () => {

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit',
      })

      const gql = `
        {
          results(query: "") {
            summary {
              appliedFilters {
                identifier
              }
              disabledFilters {
                identifier
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              type
              label
              display
              entries {
                id
                count
                label
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
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "type": Object {
                      "terms": Object {
                        "field": "type.raw",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
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

    it('Reeturn all facets when rule satisfied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [{identifier: "type", value:"Movie"}]) {
            summary {
              appliedFilters {
                identifier
              }
              disabledFilters {
                identifier
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              type
              label
              display
              entries {
                id
                count
                label
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
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "actors": Object {
                      "terms": Object {
                        "field": "actors.raw",
                        "size": 5,
                      },
                    },
                    "genres": Object {
                      "terms": Object {
                        "field": "genres.raw",
                        "size": 5,
                      },
                    },
                    "type": Object {
                      "terms": Object {
                        "field": "type.raw",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "type.raw": "Movie",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
                "facet_bucket_writers": Object {
                  "aggs": Object {
                    "writers": Object {
                      "terms": Object {
                        "field": "writers.raw",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "type.raw": "Movie",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "type.raw": "Movie",
                            },
                          },
                        ],
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

    it('should not have the writers filter applied', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [{ identifier: "writers", value: "example"}]) {
            summary {
              appliedFilters {
                identifier
              }
              disabledFilters {
                identifier
              }
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              identifier
              entries {
                id
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
              "aggs": Object {
                "facet_bucket_all": Object {
                  "aggs": Object {
                    "type": Object {
                      "terms": Object {
                        "field": "type.raw",
                        "size": 5,
                      },
                    },
                  },
                  "filter": Object {
                    "bool": Object {
                      "must": Array [],
                    },
                  },
                },
              },
              "from": 0,
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

    it('custom rule configuration', async () => {

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [{identifier: "type", value:"Movie"}]) {
            facets {
              identifier
            }
          }
        }
      `

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          return [200, HitsMock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
      const customRuleArgs = customRule.mock.calls[0]
      expect(customRuleArgs[0].getQuery()).toBe("")
      expect(customRuleArgs[1].role).toEqual("Admin")
    })
  })
})
