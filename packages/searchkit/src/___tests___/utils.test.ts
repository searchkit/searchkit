import { getFacetField, getFacetByAttribute, getFacetFieldType } from '../utils'

describe('utils', () => {
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
