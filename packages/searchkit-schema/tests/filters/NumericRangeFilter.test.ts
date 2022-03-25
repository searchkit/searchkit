import nock from 'nock'
import { NumericRangeFilter, SearchkitConfig } from '@searchkit/sdk'
import { callQuery, setupTestServer } from '../support/helper'
import HitsMock from '../__mock-data__/HitResolver/Hits.json'

describe('Numeric Range Filter', () => {
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

  it('should apply filter with min and max', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      filters: [
        new NumericRangeFilter({
          identifier: 'imdbRating',
          field: 'imdbRating',
          label: 'IMDB Rating'
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
                    "range": Object {
                      "imdbRating": Object {
                        "gte": 2,
                        "lte": 6,
                      },
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

    const response = await runQuery('{ identifier: "imdbRating", min: 2, max: 6 }')
    expect(response.body.data).toMatchInlineSnapshot(`
        Object {
          "results": Object {
            "summary": Object {
              "appliedFilters": Array [
                Object {
                  "display": "RangeFilter",
                  "id": "imdbRating_2_6",
                  "label": "IMDB Rating",
                  "max": 6,
                  "min": 2,
                },
              ],
            },
          },
        }
      `)
  })

  it('should apply filter with min only', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      filters: [
        new NumericRangeFilter({
          identifier: 'imdbRating',
          field: 'imdbRating',
          label: 'IMDB Rating'
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
                    "range": Object {
                      "imdbRating": Object {
                        "gte": 2,
                      },
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

    const response = await runQuery('{ identifier: "imdbRating", min: 2 }')
    expect(response.body.data).toMatchInlineSnapshot(`
      Object {
        "results": Object {
          "summary": Object {
            "appliedFilters": Array [
              Object {
                "display": "RangeFilter",
                "id": "imdbRating_2_undefined",
                "label": "IMDB Rating",
                "max": null,
                "min": 2,
              },
            ],
          },
        },
      }
    `)
  })

  it('should apply filter with max only', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      filters: [
        new NumericRangeFilter({
          identifier: 'imdbRating',
          field: 'imdbRating',
          label: 'IMDB Rating'
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
                    "range": Object {
                      "imdbRating": Object {
                        "lte": 2,
                      },
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

    const response = await runQuery('{ identifier: "imdbRating", max: 2 }')
    expect(response.body.data).toMatchInlineSnapshot(`
      Object {
        "results": Object {
          "summary": Object {
            "appliedFilters": Array [
              Object {
                "display": "RangeFilter",
                "id": "imdbRating_undefined_2",
                "label": "IMDB Rating",
                "max": 2,
                "min": null,
              },
            ],
          },
        },
      }
    `)
  })
})
