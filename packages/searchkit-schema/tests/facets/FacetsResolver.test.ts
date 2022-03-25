import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { MultiMatchQuery } from '@searchkit/sdk'
import { RefinementSelectFacet } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './../support/helper'
import HitsMock from './../__mock-data__/FacetsResolver/results.json'

describe('Facets Resolver', () => {
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
        new RefinementSelectFacet({
          identifier: 'writers',
          field: 'writers.raw',
          label: 'Writers',
          display: 'override',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ identifier: 'actors', field: 'actors.raw', label: 'Actors' }),
        new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
        new RefinementSelectFacet({ identifier: 'genres', field: 'genres.raw', label: 'Genres' })
      ]
    }

    it('should return correct Results', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "") {
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
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
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
                    "writers": Object {
                      "terms": Object {
                        "field": "writers.raw",
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

    it('should return correct results with one filter', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(
            query: "",
            filters: [
              { identifier: "writers", value: "Damon Lindelof" },
              { identifier: "actors", value: "Damon Lindelof" },
            ]
            ) {
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
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
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
                            "should": Array [
                              Object {
                                "term": Object {
                                  "writers.raw": "Damon Lindelof",
                                },
                              },
                            ],
                          },
                        },
                        Object {
                          "bool": Object {
                            "must": Array [
                              Object {
                                "term": Object {
                                  "actors.raw": "Damon Lindelof",
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
                                  "actors.raw": "Damon Lindelof",
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
                        "should": Array [
                          Object {
                            "term": Object {
                              "writers.raw": "Damon Lindelof",
                            },
                          },
                        ],
                      },
                    },
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "term": Object {
                              "actors.raw": "Damon Lindelof",
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
  })
})
