import { getSearchAttribute, getPageAttribute, getDocumentAttribute } from '../src/attributes'
import type { SearchResults, SearchParameters } from 'algoliasearch-helper'
import type { Hit } from 'instantsearch.js/es/types'

describe('attributes', () => {
  describe('getPageAttribute', () => {
    const hit = {
      title: 'title',
      url: 'url'
    } as unknown as Hit

    const searchClickFields = {
      titleField: 'title',
      urlField: 'url'
    }

    it('should return page attribute', () => {
      expect(getPageAttribute(hit, searchClickFields)).toMatchInlineSnapshot(`
        {
          "title": "title",
          "url": "url",
        }
      `)
    })

    it('should return page attribute', () => {
      expect(getPageAttribute(hit, undefined)).toBeUndefined()
    })
  })

  describe('getDocumentAttribute', () => {
    it('should return page attribute', () => {
      expect(getDocumentAttribute('1', 'products')).toMatchInlineSnapshot(`
        {
          "id": "1",
          "index": "products",
        }
      `)
    })
  })

  describe('getSearchAttribute', () => {
    const lastResults: SearchResults = {
      nbHits: 100,
      hits: []
    } as unknown as SearchResults

    const state: SearchParameters = {
      disjunctiveFacetsRefinements: {
        brand: ['Apple', 'Samsung']
      },
      numericRefinements: {
        price: {
          '>=': [100],
          '<=': [1000]
        },
        rating: {
          '>=': [4]
        },
        metascore: {
          '<=': [4]
        },
        stock: {
          '>=': []
        },
        stockBothRangeEmpty: {
          '>=': [],
          '<=': []
        }
      },
      query: 'iphone',
      page: 1,
      hitsPerPage: 20
    } as unknown as SearchParameters

    it('should return search attribute', () => {
      expect(getSearchAttribute(lastResults, state)).toMatchInlineSnapshot(`
        {
          "filters": {
            "brand": [
              "Apple",
              "Samsung",
            ],
            "metascore": "*-4",
            "price": "100-1000",
            "rating": "4-*",
          },
          "page": {
            "current": 1,
            "size": 20,
          },
          "query": "iphone",
          "results": {
            "items": [],
            "total_results": 100,
          },
        }
      `)
    })
  })
})
