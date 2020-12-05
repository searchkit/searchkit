import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { RefinementSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'
import nock from 'nock'
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
        fields: ['actors', 'writers']
      },
      sortOptions: [
        { id: 'relevance', label: 'Relevance', field: '_score' },
        { id: 'released', label: 'Recent Releases', field: { released: 'desc' } }
      ],
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [
        new RefinementSelectFacet({
          identifier: 'writers',
          field: 'writers.raw',
          label: 'Writers',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ identifier: 'actors', field: 'actors.raw', label: 'Actors' }),
        new RefinementSelectFacet({ identifier: 'type', field: 'type.raw', label: 'Type' }),
        new RefinementSelectFacet({ identifier: 'genres', field: 'genres.raw', label: 'Genres' })
      ]
    }

    it('should return correct summary', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "", filters: [{ identifier: "writers", value: "Jeff Lindsay" }]) {
            summary {
              total
              appliedFilters {
                identifier
                label
                value
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
              "aggs": Object {},
              "from": 0,
              "post_filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "should": Array [
                          Object {
                            "term": Object {
                              "writers.raw": "Jeff Lindsay",
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
