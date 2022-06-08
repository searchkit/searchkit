import nock from 'nock'
import SearchkitRequest from '../src'
import { MultiMatchQuery } from '../src/query'
import HitsMMock from './__mock-data__/HitResolver/Hits.json'

describe('BaseFilters', () => {
  it('Query', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      query: new MultiMatchQuery({
        fields: ['title', 'body']
      }),
      hits: {
        fields: ['facet1']
      },
      index: 'test'
    })

    request.query('test')

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "_source": Object {
              "includes": Array [
                "facet1",
              ],
            },
            "aggs": Object {},
            "from": 0,
            "query": Object {
              "bool": Object {
                "filter": Array [
                  Object {
                    "bool": Object {
                      "must": Array [
                        Object {
                          "term": Object {
                            "country": "GB",
                          },
                        },
                      ],
                      "must_not": Array [
                        Object {
                          "term": Object {
                            "status": "not_published",
                          },
                        },
                      ],
                    },
                  },
                  Object {
                    "term": Object {
                      "facet1": "test",
                    },
                  },
                ],
                "should": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title",
                        "body",
                      ],
                      "operator": "and",
                      "query": "test",
                      "type": "best_fields",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title",
                        "body",
                      ],
                      "query": "test",
                      "type": "cross_fields",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title",
                        "body",
                      ],
                      "query": "test",
                      "type": "phrase",
                    },
                  },
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title",
                        "body",
                      ],
                      "query": "test",
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
        expect((body as Record<string, any>).size).toBe(10)
        return HitsMMock
      })

    const response = await request.execute(
      {
        hits: {
          size: 10
        }
      },
      [
        {
          bool: {
            must: [
              {
                term: {
                  country: 'GB'
                }
              }
            ],
            must_not: [
              {
                term: {
                  status: 'not_published'
                }
              }
            ]
          }
        },
        {
          term: {
            facet1: 'test'
          }
        }
      ]
    )
    expect(response).toMatchSnapshot()
  })
})
