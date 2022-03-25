import nock from 'nock'
import { SearchkitConfig, MultiMatchQuery } from '../src/index'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'

describe('Base Query', () => {
  const runQuery = async (query = '', page = { size: 10, from: 0 }, sorting?: string) => {
    const gql = `
        {
          results( query: "heat", filters: [{ identifier: "type", value: "movie"}]) {
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
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
    }

    setupTestServer({
      typeName: 'ResultSet',
      hitTypeName: 'ResultHit',
      config: moviesSearchConfig,
      addToQueryType: true,
      getBaseFilters: (parent, parameters, ctx) => {
        expect(parent).toBe(undefined)
        expect(parameters).toBeDefined()
        expect(ctx).toBeDefined()
        return [{ term: { status: 'published' } }]
      }
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
                    "term": Object {
                      "status": "published",
                    },
                  },
                ],
                "should": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "actors",
                        "writers",
                        "title^4",
                        "plot",
                      ],
                      "operator": "and",
                      "query": "heat",
                      "type": "best_fields",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "actors",
                        "writers",
                        "title^4",
                        "plot",
                      ],
                      "query": "heat",
                      "type": "cross_fields",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "actors",
                        "writers",
                        "title^4",
                        "plot",
                      ],
                      "query": "heat",
                      "type": "phrase",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "actors",
                        "writers",
                        "title^4",
                        "plot",
                      ],
                      "query": "heat",
                      "type": "phrase_prefix",
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

    const response = await runQuery()
    expect(response.body.data).toMatchSnapshot('userhits')
    expect(response.status).toEqual(200)
  })
})
