import SearchkitRequest, {
  GeoBoundingBoxFilter,
  MultiMatchQuery,
  NumericRangeFilter,
  SearchkitConfig,
  TermFilter
} from '../../src'
import nock from 'nock'
import ResultsNoHitsMock from '../__mock-data__/Facets/results-no-hits.json'

describe('NumericRangeFilter', () => {
  it('Combination of min and max number filters', async () => {
    const moviesSearchConfig: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      filters: [
        new TermFilter({
          identifier: 'type',
          field: 'type',
          label: 'type'
        })
      ]
    }

    const request = SearchkitRequest(moviesSearchConfig)
    request.setFilters([
      {
        identifier: 'type',
        value: 'movie'
      }
    ])

    let lastESRequest

    const scope = nock('http://localhost:9200')
      .post('/movies/_search')
      .reply(200, (uri, body: any) => {
        expect(body.query.bool).toMatchInlineSnapshot(`
          Object {
            "filter": Array [
              Object {
                "bool": Object {
                  "filter": Array [
                    Object {
                      "term": Object {
                        "type": "movie",
                      },
                    },
                  ],
                },
              },
            ],
          }
        `)
        lastESRequest = body
        return ResultsNoHitsMock
      })
      .persist()

    let response = await request.execute({
      facets: true
    })
    expect(response).toMatchSnapshot()
    expect(response.summary.appliedFilters).toMatchInlineSnapshot(`
      Array [
        Object {
          "display": "TermFilter",
          "id": "type_movie",
          "identifier": "type",
          "label": "type",
          "type": "ValueSelectedFilter",
          "value": "movie",
        },
      ]
    `)

    //   request.setFilters([
    //     {
    //       identifier: 'imdbRating',
    //       min: 5
    //     }
    //   ])

    //   response = await request.execute({
    //     facets: true
    //   })

    //   expect(lastESRequest.query.bool.filter[0]).toMatchInlineSnapshot(`
    //     Object {
    //       "range": Object {
    //         "imdbRating": Object {
    //           "gte": 5,
    //         },
    //       },
    //     }
    //   `)
    //   expect(response.summary.appliedFilters.length).toBe(1)

    //   request.setFilters([
    //       {
    //         identifier: 'imdbRating',
    //         max: 5
    //       }
    //     ])

    //     response = await request.execute({
    //       facets: true
    //     })

    //     expect(lastESRequest.query.bool.filter[0]).toMatchInlineSnapshot(`
    //       Object {
    //         "range": Object {
    //           "imdbRating": Object {
    //             "lte": 5,
    //           },
    //         },
    //       }
    //     `)
    //     expect(response.summary.appliedFilters.length).toBe(1)
  })
})
