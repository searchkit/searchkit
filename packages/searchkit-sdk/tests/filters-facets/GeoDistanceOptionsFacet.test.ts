import nock from 'nock'
import SearchkitRequest, { SearchkitConfig, GeoDistanceOptionsFacet } from '../../src'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-geo-distance-options.json'

describe('GeoDistanceOptionsFacet', () => {
  it('range of value, min-max range facets', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'us_parks',
      hits: {
        fields: []
      },
      facets: [
        new GeoDistanceOptionsFacet({
          field: 'location',
          origin: '37.7749, -122.4194',
          unit: 'mi',
          ranges: [
            { to: 1000, label: '0 - 1000' },
            { to: 2000, label: '0 - 2000' },
            { from: 1000, to: 2000, label: '1000 - 2000' }
          ],
          label: 'location',
          identifier: 'location'
        })
      ]
    }

    const request = SearchkitRequest(moviesSearchConfig)
    request.setFilters([
      {
        identifier: 'location',
        value: '0 - 2000'
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
                "location": Object {
                  "geo_distance": Object {
                    "field": "location",
                    "keyed": true,
                    "origin": "37.7749, -122.4194",
                    "ranges": Array [
                      Object {
                        "key": "0 - 1000",
                        "to": 1000,
                      },
                      Object {
                        "key": "0 - 2000",
                        "to": 2000,
                      },
                      Object {
                        "from": 1000,
                        "key": "1000 - 2000",
                        "to": 2000,
                      },
                    ],
                    "unit": "mi",
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
                            "bool": Object {
                              "must": Array [
                                Object {
                                  "geo_distance": Object {
                                    "distance": "2000mi",
                                    "location": "37.7749, -122.4194",
                                  },
                                },
                              ],
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
          "id": "location_0 - 2000",
          "identifier": "location",
          "label": "location",
          "type": "GeoDistanceOptionsFacet",
          "value": "0 - 2000",
        },
      ]
    `)
  })
})
