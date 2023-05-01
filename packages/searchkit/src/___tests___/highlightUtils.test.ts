import { getHighlightFields, highlightTerm, isAllowableHighlightField } from '../highlightUtils'
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
          "actor.name.keyword": {
            "fullyHighlighted": false,
            "matchLevel": "full",
            "matchedWords": [
              "Keanu",
            ],
            "value": "<ais-highlight-0000000000>Keanu<ais-highlight-0000000000/> Reeves",
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
})
