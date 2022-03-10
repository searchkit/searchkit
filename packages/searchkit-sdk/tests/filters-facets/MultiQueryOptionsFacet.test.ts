import nock from 'nock'
import SearchkitRequest, { SearchkitConfig, MultiQueryOptionsFacet } from '../../src'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-multi-query-options.json'

describe('MultiQueryOptionsFacet', () => {
  it('range of value, min-max range facets', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'us_parks',
      hits: {
        fields: []
      },
      facets: [
        new MultiQueryOptionsFacet({
          field: 'visitors.keyword',
          options: [
            { min: 0, max: 10000, label: '0 - 10000' },
            { min: 10001, max: 100000, label: '10001 - 100000' },
            { min: 100001, max: 500000, label: '100001 - 500000' },
            { min: 500001, max: 1000000, label: '500001 - 1000000' },
            { min: 1000001, max: 5000000, label: '1000001 - 5000000' },
            { min: 5000001, max: 10000000, label: '5000001 - 10000000' },
            { min: 10000001, label: '10000001+' }
          ],
          label: 'Visitors',
          identifier: 'visitors'
        })
      ]
    }

    const request = SearchkitRequest(moviesSearchConfig)
    request.setFilters([
      {
        identifier: 'visitors',
        value: '0 - 10000'
      }
    ])

    let lastESRequest

    const scope = nock('http://localhost:9200')
      .post('/us_parks/_search')
      .reply(200, (uri, body: any) => {
        expect(body.aggs).toMatchInlineSnapshot(`
          Object {
            "facet_bucket_all": Object {
              "aggs": Object {
                "visitors": Object {
                  "filters": Object {
                    "filters": Object {
                      "0 - 10000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "lte": 10000,
                          },
                        },
                      },
                      "10000001+": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 10000001,
                          },
                        },
                      },
                      "1000001 - 5000000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 1000001,
                            "lte": 5000000,
                          },
                        },
                      },
                      "100001 - 500000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 100001,
                            "lte": 500000,
                          },
                        },
                      },
                      "10001 - 100000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 10001,
                            "lte": 100000,
                          },
                        },
                      },
                      "5000001 - 10000000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 5000001,
                            "lte": 10000000,
                          },
                        },
                      },
                      "500001 - 1000000": Object {
                        "range": Object {
                          "visitors.keyword": Object {
                            "gte": 500001,
                            "lte": 1000000,
                          },
                        },
                      },
                    },
                  },
                },
              },
              "filter": Object {
                "bool": Object {
                  "must": Array [
                    Object {
                      "bool": Object {
                        "must": Array [
                          Object {
                            "range": Object {
                              "visitors.keyword": Object {
                                "lte": 10000,
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          }
        `)
        lastESRequest = body
        return ResultsNoHitsMock
      })
      .persist()

    const response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "ListFacet",
          "id": "visitors_0 - 10000",
          "identifier": "visitors",
          "label": "Visitors",
          "type": "MultiQueryOptionsFacet",
          "value": "0 - 10000",
        },
      ]
    `)
  })
})
