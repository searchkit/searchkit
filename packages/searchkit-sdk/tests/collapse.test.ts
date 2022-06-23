import nock from 'nock'
import SearchkitRequest from '../src'
import HitsMMock from './__mock-data__/collapse/Hits.json'

describe('Collapse', () => {
  it('Collapse basic', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      collapse: {
        field: 'designername.keyword',
        inner_hits: {
          name: 'test',
          size: 4,
          _source: ['test']
        }
      },
      hits: {
        fields: ['facet1']
      },
      index: 'test'
    })

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
            "collapse": Object {
              "field": "designername.keyword",
              "inner_hits": Object {
                "_source": Array [
                  "test",
                ],
                "name": "test",
                "size": 4,
              },
            },
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
