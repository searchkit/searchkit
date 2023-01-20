import { RelevanceQueryMatch } from '../transformRequest'

describe('relevance query match', () => {
  it('should work', () => {
    expect(RelevanceQueryMatch('test', ['title', 'description'])).toMatchInlineSnapshot(`
      {
        "bool": {
          "should": [
            {
              "bool": {
                "should": [
                  {
                    "multi_match": {
                      "fields": [
                        "title",
                        "description",
                      ],
                      "fuzziness": "AUTO:4,8",
                      "query": "test",
                    },
                  },
                  {
                    "multi_match": {
                      "fields": [
                        "title",
                        "description",
                      ],
                      "query": "test",
                      "type": "bool_prefix",
                    },
                  },
                ],
              },
            },
            {
              "multi_match": {
                "fields": [
                  "title",
                  "description",
                ],
                "query": "test",
                "type": "phrase",
              },
            },
          ],
        },
      }
    `)
  })

  it('should work with function score', () => {
    expect(RelevanceQueryMatch('test', ['title', 'description'])).toMatchInlineSnapshot(`
      {
        "bool": {
          "should": [
            {
              "bool": {
                "should": [
                  {
                    "multi_match": {
                      "fields": [
                        "title",
                        "description",
                      ],
                      "fuzziness": "AUTO:4,8",
                      "query": "test",
                    },
                  },
                  {
                    "multi_match": {
                      "fields": [
                        "title",
                        "description",
                      ],
                      "query": "test",
                      "type": "bool_prefix",
                    },
                  },
                ],
              },
            },
            {
              "multi_match": {
                "fields": [
                  "title",
                  "description",
                ],
                "query": "test",
                "type": "phrase",
              },
            },
          ],
        },
      }
    `)
  })
})
