import nock from 'nock'
import SearchkitRequest, { SearchkitConfig, TermFilter } from '../../src'
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

    const response = await request.execute({
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
  })
})
