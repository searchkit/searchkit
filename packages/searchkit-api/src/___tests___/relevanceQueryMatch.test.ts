import { RelevanceQueryMatch } from '../transformRequest'

describe('relevance query match', () => {
  it('should work', () => {
    expect(RelevanceQueryMatch('test', ['title', 'description'])).toMatchInlineSnapshot(`
      {
        "combined_fields": {
          "fields": [
            "title",
            "description",
          ],
          "query": "test",
        },
      }
    `)
  })

  it('should work with function score', () => {
    expect(RelevanceQueryMatch('test', ['title', 'description'])).toMatchInlineSnapshot(`
      {
        "combined_fields": {
          "fields": [
            "title",
            "description",
          ],
          "query": "test",
        },
      }
    `)
  })
})
