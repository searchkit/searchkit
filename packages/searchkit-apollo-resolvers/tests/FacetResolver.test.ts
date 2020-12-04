import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { RefinementSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'
import nock from 'nock'
import FacetMock from './__mock-data__/FacetResolver/Facet.json'

describe('Facet Resolver', () => {
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
          id: 'writers',
          field: 'writers.raw',
          label: 'Writers',
          multipleSelect: true
        })
      ]
    }

    it('should return correct Results', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "") {
            facet(id: "writers", query: "te") {
              id
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
                    "writers": Object {
                      "terms": Object {
                        "field": "writers.raw",
                        "include": "[tT][eE].*",
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
              "post_filter": Object {
                "bool": Object {
                  "must": Array [],
                },
              },
              "size": 0,
            }
          `)
          return [200, FacetMock]
        })

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('Adjust size at query time', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "") {
            facet(id: "writers", size: 20) {
              id
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
        .reply((uri, body: any) => {
          expect(body.aggs.facet_bucket_all.aggs.writers.terms.size).toEqual(20)
          return [200, FacetMock]
        })

      const response = await runQuery(gql)
      expect(response.status).toEqual(200)
    })

    it('Adjust size at configuration', async () => {
      setupTestServer({
        ...config,
        facets: [
          new RefinementSelectFacet({
            id: 'writers',
            field: 'writers.raw',
            label: 'Writers',
            multipleSelect: true,
            size: 30
          })
        ]
      })

      const gql = `
        {
          results(query: "") {
            facet(id: "writers") {
              id
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
        .reply((uri, body: any) => {
          expect(body.aggs.facet_bucket_all.aggs.writers.terms.size).toEqual(30)
          return [200, FacetMock]
        })

      const response = await runQuery(gql)
      expect(response.status).toEqual(200)
    })
  })
})
