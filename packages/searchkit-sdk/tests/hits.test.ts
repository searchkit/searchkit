import nock from 'nock'
import SearchkitRequest from '../src'
import { MultiMatchQuery } from '../src/query'
import HitsMMock from './__mock-data__/HitResolver/Hits.json'

describe('Hit Results', () => {
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

    const response = await request.execute({
      hits: {
        size: 10
      }
    })
    expect(response).toMatchSnapshot()
    expect(response.facets).toBeFalsy()
    expect(response.summary.query).toBe('test')
    expect(response.summary.total).toBe(4162)
  })

  it('pagination - 2nd page', async () => {
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
      .reply(200, (uri, body: any) => {
        expect(body.from).toBe(10)
        expect(body.size).toBe(10)
        return HitsMMock
      })

    const response = await request.execute({
      hits: {
        size: 10,
        from: 10
      }
    })
    expect(response).toMatchSnapshot()
    expect(response.hits.items[0].rawHit).not.toBeDefined()
    expect(response.facets).toBeFalsy()
    expect(response.summary.query).toBe('test')
    expect(response.summary.total).toBe(4162)
  })

  it('includes raw hit', async () => {
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
      .reply(200, (uri, body: any) => HitsMMock)

    const response = await request.execute({
      hits: {
        size: 10,
        from: 10,
        includeRawHit: true
      }
    })
    expect(response.hits.items[0].rawHit).toBeDefined()
  })
})
