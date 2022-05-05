import nock from 'nock'
import SearchkitRequest from '../../src'
import { HitsSuggestor, PrefixQuery } from '../../src'
import HitsMMock from '../__mock-data__/suggestors/Hits.json'

describe('Suggestions', () => {
  it('HitsSuggestor', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      index: 'test',
      suggestions: [
        new HitsSuggestor({
          index: 'mrp-products',
          identifier: 'hits',
          hits: {
            fields: ['name', 'designerName'],
            highlightedFields: ['name', 'designerName']
          },
          query: new PrefixQuery({
            fields: ['title_suggest', 'title_suggest.2gram', 'title_suggest.3gram']
          })
        })
      ]
    })

    const scope = nock('http://localhost:9200')
      .post('/mrp-products/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "_source": Object {
              "includes": Array [
                "name",
                "designerName",
              ],
            },
            "highlight": Object {
              "fields": Object {
                "designerName": Object {},
                "name": Object {},
              },
            },
            "query": Object {
              "bool": Object {
                "must": Array [
                  Object {
                    "multi_match": Object {
                      "fields": Array [
                        "title_suggest",
                        "title_suggest.2gram",
                        "title_suggest.3gram",
                      ],
                      "query": "test",
                      "type": "bool_prefix",
                    },
                  },
                ],
              },
            },
            "size": 5,
          }
        `)
        expect((body as Record<string, any>).size).toBe(5)
        return HitsMMock
      })

    const results = await request.executeSuggestions('test')
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "hits": Array [
            Object {
              "fields": Object {
                "designerName": "GUCCI",
                "name": "Slim-Fit Logo-Jacquard Cotton and Silk-Blend Polo Shirt",
              },
              "highlight": Object {
                "title_suggest._index_prefix": Array [
                  "GUCCI Slim-Fit Logo-Jacquard Cotton and Silk-Blend Polo <em>Shirt</em>",
                ],
              },
              "id": "10163292707229244",
              "rawHit": Object {
                "_id": "10163292707229244",
                "_index": "mrp-products",
                "_score": 1,
                "_source": Object {
                  "designerName": "GUCCI",
                  "name": "Slim-Fit Logo-Jacquard Cotton and Silk-Blend Polo Shirt",
                },
                "highlight": Object {
                  "title_suggest._index_prefix": Array [
                    "GUCCI Slim-Fit Logo-Jacquard Cotton and Silk-Blend Polo <em>Shirt</em>",
                  ],
                },
              },
            },
            Object {
              "fields": Object {
                "designerName": "FEAR OF GOD",
                "name": "Logo-Flocked Cotton-Jersey T-Shirt",
              },
              "highlight": Object {
                "title_suggest._index_prefix": Array [
                  "FEAR OF GOD Logo-Flocked Cotton-Jersey T-<em>Shirt</em>",
                ],
              },
              "id": "560971904241887",
              "rawHit": Object {
                "_id": "560971904241887",
                "_index": "mrp-products",
                "_score": 1,
                "_source": Object {
                  "designerName": "FEAR OF GOD",
                  "name": "Logo-Flocked Cotton-Jersey T-Shirt",
                },
                "highlight": Object {
                  "title_suggest._index_prefix": Array [
                    "FEAR OF GOD Logo-Flocked Cotton-Jersey T-<em>Shirt</em>",
                  ],
                },
              },
            },
            Object {
              "fields": Object {
                "designerName": "VETEMENTS",
                "name": "Oversized Logo-Embroidered Printed Cotton-Jersey T-Shirt",
              },
              "highlight": Object {
                "title_suggest._index_prefix": Array [
                  "VETEMENTS Oversized Logo-Embroidered Printed Cotton-Jersey T-<em>Shirt</em>",
                ],
              },
              "id": "11452292647412043",
              "rawHit": Object {
                "_id": "11452292647412043",
                "_index": "mrp-products",
                "_score": 1,
                "_source": Object {
                  "designerName": "VETEMENTS",
                  "name": "Oversized Logo-Embroidered Printed Cotton-Jersey T-Shirt",
                },
                "highlight": Object {
                  "title_suggest._index_prefix": Array [
                    "VETEMENTS Oversized Logo-Embroidered Printed Cotton-Jersey T-<em>Shirt</em>",
                  ],
                },
              },
            },
            Object {
              "fields": Object {
                "designerName": "JAMES PERSE",
                "name": "Cotton-Jersey T-Shirt",
              },
              "highlight": Object {
                "title_suggest._index_prefix": Array [
                  "JAMES PERSE Cotton-Jersey T-<em>Shirt</em>",
                ],
              },
              "id": "13452677150717069",
              "rawHit": Object {
                "_id": "13452677150717069",
                "_index": "mrp-products",
                "_score": 1,
                "_source": Object {
                  "designerName": "JAMES PERSE",
                  "name": "Cotton-Jersey T-Shirt",
                },
                "highlight": Object {
                  "title_suggest._index_prefix": Array [
                    "JAMES PERSE Cotton-Jersey T-<em>Shirt</em>",
                  ],
                },
              },
            },
            Object {
              "fields": Object {
                "designerName": "ORLEBAR BROWN",
                "name": "Holman Slim-Fit Striped Sea Island Cotton Polo Shirt",
              },
              "highlight": Object {
                "title_suggest._index_prefix": Array [
                  "ORLEBAR BROWN Holman Slim-Fit Striped Sea Island Cotton Polo <em>Shirt</em>",
                ],
              },
              "id": "9465239339532782",
              "rawHit": Object {
                "_id": "9465239339532782",
                "_index": "mrp-products",
                "_score": 1,
                "_source": Object {
                  "designerName": "ORLEBAR BROWN",
                  "name": "Holman Slim-Fit Striped Sea Island Cotton Polo Shirt",
                },
                "highlight": Object {
                  "title_suggest._index_prefix": Array [
                    "ORLEBAR BROWN Holman Slim-Fit Striped Sea Island Cotton Polo <em>Shirt</em>",
                  ],
                },
              },
            },
          ],
          "identifier": "hits",
        },
      ]
    `)
  })
})
