import nock from 'nock'
import SearchkitRequest from '../../src'
import { MultiMatchQuery } from '../../src/query'
import HitsMMock from '../__mock-data__/HitResolver/Hits.json'

describe('Base Filters', () => {
  it('Example implementation', async () => {
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
                    "term": Object {
                      "status": "published",
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
      [{ term: { status: 'published' } }]
    )
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeFalsy()
    expect(response.summary.query).toBe('test')
    expect(response.summary.total).toBe(4162)
  })
})
