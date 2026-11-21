import {
  getFacetField,
  getFacetByAttribute,
  getFacetFieldType,
  createRegexQuery,
  deepMerge
} from '../utils'

describe('utils', () => {
  describe('deepMerge', () => {
    it('merges nested aggregations that share a nested path', () => {
      const a = {
        'user.': { nested: { path: 'user' }, aggs: { first: { terms: { field: 'user.first' } } } }
      }
      const b = {
        'user.': { nested: { path: 'user' }, aggs: { last: { terms: { field: 'user.last' } } } }
      }
      expect(deepMerge(a, b)).toEqual({
        'user.': {
          nested: { path: 'user' },
          aggs: {
            first: { terms: { field: 'user.first' } },
            last: { terms: { field: 'user.last' } }
          }
        }
      })
    })

    it('does not mutate its inputs', () => {
      const a = { x: { y: 1 } }
      const b = { x: { z: 2 } }
      deepMerge(a, b)
      expect(a).toEqual({ x: { y: 1 } })
      expect(b).toEqual({ x: { z: 2 } })
    })

    it('concatenates arrays and overwrites scalars', () => {
      expect(deepMerge({ a: [1], b: 1 }, { a: [2], b: 2 })).toEqual({ a: [1, 2], b: 2 })
    })

    it('ignores prototype-polluting keys', () => {
      const malicious = JSON.parse(
        '{"__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}}'
      )
      const result: any = deepMerge({}, malicious)
      expect(({} as any).polluted).toBeUndefined()
      expect(result.polluted).toBeUndefined()
      expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
    })
  })

  describe('createRegexQuery', () => {
    it('should create regex', () => {
      expect(createRegexQuery('test')).toBe('(.* )?[tT][eE][sS][tT].*')
    })

    it('should create empty regex', () => {
      expect(createRegexQuery('')).toBe('.*')
    })

    it('should create empty regex', () => {
      expect(createRegexQuery('a')).toBe('[aA].*')
    })

    it('should be case insensitive for uppercase input', () => {
      expect(createRegexQuery('Hey')).toBe('(.* )?[hH][eE][yY].*')
      expect(createRegexQuery('HeY')).toBe('(.* )?[hH][eE][yY].*')
      expect(createRegexQuery('HEY')).toBe('(.* )?[hH][eE][yY].*')
    })

    // https://github.com/searchkit/searchkit/issues/1423
    it('should escape Lucene regex operators', () => {
      expect(createRegexQuery('R&B')).toBe('(.* )?[rR]\\&[bB].*')
      expect(createRegexQuery('C#')).toBe('[cC]\\#.*')
      expect(createRegexQuery('@~')).toBe('\\@\\~.*')
      expect(createRegexQuery('<a>')).toBe('(.* )?\\<[aA]\\>.*')
      expect(createRegexQuery('"x"')).toBe('(.* )?\\"[xX]\\".*')
    })
  })

  describe('getFacetField', () => {
    it('getFacetField - default config', () => {
      expect(
        getFacetField(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          'type'
        )
      ).toBe('type')
    })

    it('getFacetField - complex config', () => {
      expect(
        getFacetField(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          'imdbRating'
        )
      ).toBe('imdbRating')
    })

    it('getFacetField - complex config with override', () => {
      expect(
        getFacetField(
          [
            'type',
            {
              attribute: 'imdbRating',
              field: 'field.override',
              type: 'numeric'
            }
          ],
          'imdbRating'
        )
      ).toBe('field.override')
    })
  })

  describe('getFacetAttribute', () => {
    it('getFacetAttribute - default config', () => {
      expect(
        getFacetByAttribute(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          'type'
        )
      ).toBe('type')
    })

    it('getFacetAttribute - complex config', () => {
      expect(
        getFacetByAttribute(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          {
            attribute: 'imdbRating',
            type: 'numeric',
            field: 'imdbRating'
          }
        )
      ).toBe('imdbRating')
    })
  })

  describe('getFacetFieldType', () => {
    it('getFacetFieldType - default config', () => {
      expect(
        getFacetFieldType(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          'type'
        )
      ).toBe('string')
    })

    it('getFacetFieldType - complex config', () => {
      expect(
        getFacetFieldType(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          {
            attribute: 'imdbRating',
            type: 'numeric',
            field: 'imdbRating'
          }
        )
      ).toBe('numeric')
    })

    it('getFacetFieldType - complex config', () => {
      expect(
        getFacetFieldType(
          ['type', { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }],
          'imdbRating'
        )
      ).toBe('numeric')
    })
  })
})
