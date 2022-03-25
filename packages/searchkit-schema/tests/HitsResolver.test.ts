import nock from 'nock'
import { gql } from 'apollo-server-micro'
import { MultiMatchQuery, SearchkitConfig } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'
import HighlightHitsMock from './__mock-data__/HitResolver/HighlightHits.json'

describe('Hits Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (
      query = '',
      page = { size: 10, from: 0 },
      sorting?: string,
      includeHighlight?: boolean
    ) => {
      const gql = `
        {
          results(query: "${query}") {
            hits(page: {size: ${page.size}, from: ${page.from}} ${
        sorting ? `, sortBy: "${sorting}"` : ''
      }) {
              sortedBy
              items {
                ... on ResultHit {
                  id
                  fields {
                    writers
                    actors
                  }
                  ${includeHighlight ? 'highlight' : ''}
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
      const config: SearchkitConfig = {
        host: 'http://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers']
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
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
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('should return correct Results with https', async () => {
      const config: SearchkitConfig = {
        host: 'https://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers']
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const scope = nock('https://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          expect(body).toMatchInlineSnapshot(`
            Object {
              "aggs": Object {},
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

      const response = await runQuery()
      expect(response.status).toEqual(200)
    })

    it('should return correct Results on page 2', async () => {
      const config: SearchkitConfig = {
        host: 'http://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers']
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

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
              "from": 10,
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

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const response = await runQuery('', { size: 10, from: 10 })
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('should provide sorting options', async () => {
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
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
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
              "from": 10,
              "size": 10,
              "sort": "_score",
            }
          `)
          return [200, HitsMock]
        })

      let response = await runQuery('', { size: 10, from: 10 }, 'relevance')
      expect(response.body.data).toMatchSnapshot()

      scope.post('/movies/_search').reply((uri, body) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "_source": Object {
              "includes": Array [
                "actors",
                "writers",
              ],
            },
            "aggs": Object {},
            "from": 10,
            "size": 10,
            "sort": Object {
              "released": "desc",
            },
          }
        `)
        return [200, HitsMock]
      })

      response = await runQuery('', { size: 10, from: 10 }, 'released')
      expect(response.body.data).toMatchSnapshot()

      expect(response.status).toEqual(200)
    })

    it('should return correct highlight Results', async () => {
      const config: SearchkitConfig = {
        host: 'http://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers'],
          highlightedFields: [
            'actors',
            { field: 'writers', config: { pre_tags: ['<b>'], post_tags: ['</b>'] } }
          ]
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer(
        {
          config,
          addToQueryType: true,
          typeName: 'ResultSet',
          hitTypeName: 'ResultHit'
        },
        gql`
          type Query {
            root: String
          }

          type Mutation {
            root: String
          }

          type HitFields {
            title: String
            writers: [String]
            actors: [String]
            plot: String
            poster: String
          }

          type ResultHit implements SKHit {
            id: ID!
            fields: HitFields
            highlight: String
          }
        `,
        {
          ResultHit: {
            highlight: (hit: any) => JSON.stringify(hit.highlight)
          }
        }
      )

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
              "highlight": Object {
                "fields": Object {
                  "actors": Object {},
                  "writers": Object {
                    "post_tags": Array [
                      "</b>",
                    ],
                    "pre_tags": Array [
                      "<b>",
                    ],
                  },
                },
              },
              "query": Object {
                "bool": Object {
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
                        "query": "al",
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
                        "query": "al",
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
                        "query": "al",
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
                        "query": "al",
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
          return [200, HighlightHitsMock]
        })

      const response = await runQuery('al', { size: 10, from: 0 }, undefined, true)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
