import { getFieldValue, getHighlightFields, highlightTerm, isAllowableHighlightField } from '../highlightUtils'
import { ElasticsearchHit } from '../types'

describe('highlight utils', () => {
  it('should highlight one match', () => {
    expect(highlightTerm('some random string', 'some')).toBe('<em>some</em> random string')
  })

  describe('isAllowableHighlightField', () => {
    it('should match on exact string', () => {
      expect(isAllowableHighlightField('title', ['title'])).toBeTruthy()
    })

    it('should match on wildcard', () => {
      expect(isAllowableHighlightField('actor.name.keyword', ['actor.*'])).toBeTruthy()
    })

    it('should not match on unknown fields', () => {
      expect(isAllowableHighlightField('title', ['actor'])).toBeFalsy()
    })

    it('should match against everything', () => {
      expect(isAllowableHighlightField('actor.name.keyword', ['*'])).toBeTruthy()
    })

    it('should not match on empty highlightFields', () => {
      expect(isAllowableHighlightField('title', [])).toBeFalsy()
    })
  })

  describe('getHighlightFields', () => {
    it('should match on a field', () => {
      const hit: ElasticsearchHit = {
        _id: 'test',
        _index: 'index',
        _source: {
          title: 'The Lion King'
        },
        highlight: {
          title: ['The <em>Lion</em> King']
        }
      }

      expect(getHighlightFields(hit, undefined, undefined, ['title'])).toMatchInlineSnapshot(`
        {
          "title": {
            "fullyHighlighted": false,
            "matchLevel": "full",
            "matchedWords": [
              "Lion",
            ],
            "value": "The <ais-highlight-0000000000>Lion<ais-highlight-0000000000/> King",
          },
        }
      `)
    })

    it('should match on a object field', () => {
      const hit: ElasticsearchHit = {
        _index: 'test_index',
        _id: '4b4876e1-5749-4d5f-95b6-2251681c96e1',
        _score: 1.0,
        _source: {
          metadata: {
            publisher: 'Albert Einstein',
            publicationYear: '2023'
          }
        },
        highlight: {
          'metadata.publisher': ['<em>Albert</em> Einstein']
        }
      }

      expect(getHighlightFields(hit, undefined, undefined, ['metadata.publisher']))
        .toMatchInlineSnapshot(`
        {
          "metadata": {
            "publisher": {
              "fullyHighlighted": false,
              "matchLevel": "full",
              "matchedWords": [
                "Albert",
              ],
              "value": "<ais-highlight-0000000000>Albert<ais-highlight-0000000000/> Einstein",
            },
          },
        }
      `)
    })

    it('should match on wildcards', () => {
      const hit: ElasticsearchHit = {
        _id: 'test',
        _index: 'index',
        _source: {
          actor: {
            name: 'Keanu Reeves'
          }
        },
        highlight: {
          ['actor.name.keyword']: ['<em>Keanu</em> Reeves']
        }
      }

      expect(getHighlightFields(hit, undefined, undefined, ['actor.*'])).toMatchInlineSnapshot(`
        {
          "actor": {
            "name": {
              "keyword": {
                "fullyHighlighted": false,
                "matchLevel": "full",
                "matchedWords": [
                  "Keanu",
                ],
                "value": "<ais-highlight-0000000000>Keanu<ais-highlight-0000000000/> Reeves",
              },
            },
          },
        }
      `)
    })
  })

  it('should have matches and source value is an array', () => {
    const hit: ElasticsearchHit = {
      _id: 'test',
      _index: 'index',
      _source: {
        actors: ['Robert De Niro', 'Al Pacino']
      },
      highlight: {
        actors: ['The <em>Robert</em> De Niro']
      }
    }

    expect(getHighlightFields(hit, undefined, undefined, ['actors'])).toMatchInlineSnapshot(`
      {
        "actors": [
          {
            "fullyHighlighted": false,
            "matchLevel": "full",
            "matchedWords": [
              "Robert",
            ],
            "value": "The <ais-highlight-0000000000>Robert<ais-highlight-0000000000/> De Niro",
          },
        ],
      }
    `)
  })

  it('should not have matches and source value is an array', () => {
    const hit: ElasticsearchHit = {
      _id: 'test',
      _index: 'index',
      _source: {
        actors: ['Robert De Niro', 'Al Pacino']
      },
      highlight: {}
    }

    expect(getHighlightFields(hit, undefined, undefined, ['actors'])).toMatchInlineSnapshot(`
      {
        "actors": [
          {
            "matchLevel": "none",
            "matchedWords": [],
            "value": "Robert De Niro",
          },
          {
            "matchLevel": "none",
            "matchedWords": [],
            "value": "Al Pacino",
          },
        ],
      }
    `)
  })

  it('should have no matches', () => {
    const hit: ElasticsearchHit = {
      _id: 'test',
      _index: 'index',
      _source: {
        title: 'The Lion King'
      },
      highlight: {}
    }

    expect(getHighlightFields(hit, undefined, undefined, ['title'])).toMatchInlineSnapshot(`
      {
        "title": {
          "matchLevel": "none",
          "matchedWords": [],
          "value": "The Lion King",
        },
      }
    `)
  })

  describe('getFieldValue', () => {
    it('should retrieve a top-level field value', () => {
      const obj = { title: 'The Lion King' }
      expect(getFieldValue(obj, 'title')).toBe('The Lion King')
    })

    it('should retrieve a deeply nested field value', () => {
      const obj = { metadata: { publisher: 'Albert Einstein' } }
      expect(getFieldValue(obj, 'metadata.publisher')).toBe('Albert Einstein')
    })

    it('should retrieve an array of values from a nested array field', () => {
      const obj = {
        messages: [
          { text: 'Hello, world!' },
          { text: 'Search engines are cool.' },
        ],
      }
      expect(getFieldValue(obj, 'messages.text')).toEqual([
        'Hello, world!',
        'Search engines are cool.',
      ])
    })

    it('should return undefined if a nested field does not exist', () => {
      const obj = { metadata: { publisher: 'Albert Einstein' } }
      expect(getFieldValue(obj, 'metadata.year')).toBeUndefined()
    })

    it('should return undefined if the path leads to a non-existent field', () => {
      const obj = { title: 'The Lion King' }
      expect(getFieldValue(obj, 'nonexistentField')).toBeUndefined()
    })

    it('should handle arrays with objects missing the requested field', () => {
      const obj = {
        messages: [
          { text: 'Hello, world!' },
          { otherField: 'No text here' },
        ],
      }
      expect(getFieldValue(obj, 'messages.text')).toEqual([
        'Hello, world!',
        undefined,
      ])
    })

    it('should return undefined if the initial object is null or undefined', () => {
      expect(getFieldValue(null, 'title')).toBeUndefined()
      expect(getFieldValue(undefined, 'title')).toBeUndefined()
    })

    it('should handle nested arrays properly', () => {
      const obj = {
        messages: [
          { text: ['Hello', 'World'] },
          { text: ['Search', 'Engine'] },
        ],
      }
      expect(getFieldValue(obj, 'messages.text')).toEqual([
        ['Hello', 'World'],
        ['Search', 'Engine'],
      ])
    })
  })
})
