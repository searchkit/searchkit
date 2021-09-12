import nock from 'nock'
import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery, NumericRangeFilter, TermFilter } from '../src'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'

describe('Filters', () => {
  const runQuery = async (filters = '[]') => {
    const gql = `
        {
          results( query: "heat", filters: ${filters}) {
            hits {
              items {
                ... on ResultHit {
                  id
                  fields {
                    writers
                    actors
                  }
                }
              }
            }
          }
        }
      `
    const response = await callQuery({ gql })
    return response
  }

  it('should return correct Results', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      filters: [
        new TermFilter({
          field: 'actors',
          identifier: 'actors',
          label: 'Actors'
        }),
        new NumericRangeFilter({
          field: 'imdbRating',
          identifier: 'imdbr',
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
                            "actors": "Actor 1",
                          },
                        },
                      ],
                    },
                  },
                  Object {
                    "range": Object {
                      "imdbRating": Object {
                        "gte": 0,
                        "lte": 73,
                      },
                    },
                  },
                ],
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "actors",
                        "writers",
                        "title^4",
                        "plot",
                      ],
                      "query": "heat",
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

    const response = await runQuery(`[
      { identifier:"actors", value: "Actor 1" },
      { identifier:"imdbr", min: 0, max: 73 }
    ]`)
    expect(response.body.data).toMatchSnapshot('userhits')
    expect(response.status).toEqual(200)
  })
})
