import nock from 'nock'
import SearchkitRequest from '../src'
import HitsMMock from './__mock-data__/HitResolver/Hits.json'

describe('SortBy', () => {
  it('Default behaviour', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      sortOptions: [
        { id: 'relevance', label: 'Relevance', field: '_score' },
        { id: 'released', label: 'Recent Releases', field: { released: 'desc' } }
      ],
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
            "from": 0,
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

    let response = await request.execute({
      hits: {
        size: 10
      }
    })
    expect(response).toMatchSnapshot()
    expect(response.sortedBy).toBeFalsy()

    request.setSortBy('released')

    nock('http://localhost:9200')
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
            "size": 10,
            "sort": Object {
              "released": "desc",
            },
          }
        `)
        return HitsMMock
      })

    response = await request.execute({
      hits: {
        size: 10
      }
    })
    expect(response.facets).toBeFalsy()
    expect(response.sortedBy).toBe('released')
  })

  it('default option', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      sortOptions: [
        { id: 'relevance', label: 'Relevance', field: '_score' },
        {
          id: 'released',
          label: 'Recent Releases',
          field: { released: 'desc' },
          defaultOption: true
        }
      ],
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
            "from": 0,
            "size": 10,
            "sort": Object {
              "released": "desc",
            },
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
    expect(response.sortedBy).toBe('released')
  })
})
