import nock from 'nock'
import SearchkitRequest from '../../src'
import { CompletionSuggester } from '../../src'
import CompletionsMock from '../__mock-data__/suggestors/Completion.json'

describe('Suggestions', () => {
  it('Completion Suggestor', async () => {
    const request = SearchkitRequest({
      host: 'http://localhost:9200',
      index: 'test',
      suggestions: [
        new CompletionSuggester({
          index: 'mrp-products',
          identifier: 'completion',
          field: 'suggestions'
        })
      ]
    })

    const scope = nock('http://localhost:9200')
      .post('/mrp-products/_search')
      .reply(200, (uri, body) => {
        expect(body).toMatchInlineSnapshot(`
          Object {
            "_source": Array [],
            "size": 0,
            "suggest": Object {
              "suggest": Object {
                "completion": Object {
                  "field": "suggestions",
                  "fuzzy": Object {
                    "fuzziness": 1,
                  },
                  "size": 5,
                  "skip_duplicates": true,
                },
                "prefix": "swe",
              },
            },
          }
        `)
        return CompletionsMock
      })

    const results = await request.executeSuggestions('swe')
    expect(results).toMatchInlineSnapshot(`
      Array [
        Object {
          "identifier": "completion",
          "suggestions": Array [
            "Sweatpants",
            "Sweats",
            "Swimwear",
          ],
        },
      ]
    `)
  })
})
