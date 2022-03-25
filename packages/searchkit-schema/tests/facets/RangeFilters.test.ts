import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { MultiMatchQuery } from '@searchkit/sdk'
import { DateRangeFacet, RangeFacet } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './../support/helper'
import HitsMock from './../__mock-data__/FacetsResolver/results.json'

describe('Range Facets', () => {
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
        new RangeFacet({
          field: 'imdbRating',
          label: 'IMDB Rating',
          identifier: 'imdbRating',
          range: {
            min: 0,
            max: 100,
            interval: 10
          }
        }),
        new DateRangeFacet({
          field: 'released',
          label: 'Released',
          identifier: 'released'
        })
      ]
    }

    it('numeric range optional max', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [
            { identifier: "imdbRating", min: 0 }
          ]) {
            hits(page: {size: 10, from: 0 }) {
              items {
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
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {},
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "range": Object {
                        "imdbRating": Object {
                          "gte": 0,
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

    it('date range optional max', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const gql = `
        {
          results(query: "", filters: [
            { identifier: "released", dateMin: "2012-12-18T00:00:00.000Z" }
          ]) {
            hits(page: {size: 10, from: 0 }) {
              items {
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
              "_source": Object {
                "includes": Array [
                  "actors",
                  "writers",
                ],
              },
              "aggs": Object {},
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "range": Object {
                        "released": Object {
                          "gte": "2012-12-18T00:00:00.000Z",
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
