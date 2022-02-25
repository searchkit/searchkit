import nock from 'nock'
import SearchkitRequest from '../src'
import { MultiMatchQuery } from '../src/query'
import HitsMMock from './__mock-data__/HitResolver/Hits.json'

describe('PostProcessRequest', () => {
  it('Query', async () => {
    const postProcessRequestExampleFn = jest.fn().mockImplementation((requestBody) => {
      requestBody.query.bool.must[0].multi_match.query = 'changed query'
      return requestBody
    })
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      query: new MultiMatchQuery({
        fields: ['title', 'body']
      }),
      hits: {
        fields: ['facet1']
      },
      index: 'test',
      postProcessRequest: postProcessRequestExampleFn
    })

    request.query('test')

    const scope = nock('http://localhost:9200')
      .post('/test/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "aggs": Object {},
            "from": 0,
            "query": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title",
                        "body",
                      ],
                      "query": "changed query",
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
})
