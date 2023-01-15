import { getAggs, getHighlightFields, getHitFields } from '../transformRequest'
import { SimpleRequest } from './mocks/AlgoliaRequests'

describe('transformRequest', () => {
  describe('getHighlightFields', () => {
    it('should provide actors and title as highlighted', () => {
      expect(
        getHighlightFields(SimpleRequest[0], {
          highlight_attributes: ['title', 'actors'],
          result_attributes: [],
          search_attributes: []
        })
      ).toMatchInlineSnapshot(`
        {
          "highlight": {
            "fields": {
              "actors": {
                "number_of_fragments": 0,
              },
              "title": {
                "number_of_fragments": 0,
              },
            },
            "post_tags": [
              "</em>",
            ],
            "pre_tags": [
              "<em>",
            ],
          },
        }
      `)
    })

    it('should not provide fields to be highlighted', () => {
      expect(
        getHighlightFields(SimpleRequest[0], {
          highlight_attributes: [],
          result_attributes: [],
          search_attributes: []
        })
      ).toMatchInlineSnapshot(`
        {
          "highlight": {
            "fields": {},
            "post_tags": [
              "</em>",
            ],
            "pre_tags": [
              "<em>",
            ],
          },
        }
      `)
    })
  })

  describe('getHitFields', () => {
    it('should get hit fields', () => {
      expect(
        getHitFields(SimpleRequest[0], {
          result_attributes: ['title', 'actors'],
          search_attributes: ['test']
        })
      ).toMatchInlineSnapshot(`
        {
          "_source": {
            "includes": [
              "title",
              "actors",
            ],
          },
        }
      `)
    })
  })

  describe('getAggs', () => {
    it('should work for all facets', () => {
      expect(
        getAggs(
          SimpleRequest[0],
          {
            search_attributes: [],
            result_attributes: [],
            facet_attributes: [
              'type',
              { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }
            ]
          },
          {
            query: '',
            boostFunctions: [],
            facetAttributesOrder: undefined,
            pinnedDocs: [],
            userData: [],
            touched: false,
            ruleIds: [],
            baseFilters: []
          }
        )
      ).toMatchInlineSnapshot(`
        {
          "imdbRating$_entries": {
            "terms": {
              "field": "imdbRating",
              "size": 10,
            },
          },
          "imdbRating$_stats": {
            "stats": {
              "field": "imdbRating",
            },
          },
          "type": {
            "terms": {
              "field": "type",
              "size": 10,
            },
          },
        }
      `)
    })
  })

  it('should work for all facets', () => {
    expect(
      getAggs(
        {
          ...SimpleRequest[0],
          params: {
            ...SimpleRequest[0].params,
            // @ts-ignore
            facets: 'imdbRating'
          }
        },
        {
          search_attributes: [],
          result_attributes: [],
          facet_attributes: [
            'type',
            { attribute: 'imdbRating', field: 'imdbRating', type: 'numeric' }
          ]
        },
        {
          query: '',
          boostFunctions: [],
          facetAttributesOrder: undefined,
          pinnedDocs: [],
          userData: []
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "imdbRating$_entries": {
          "terms": {
            "field": "imdbRating",
            "size": 10,
          },
        },
        "imdbRating$_stats": {
          "stats": {
            "field": "imdbRating",
          },
        },
      }
    `)
  })

  it('should prune facets when query rules are specified', () => {
    expect(
      getAggs(
        {
          ...SimpleRequest[0]
        },
        {
          search_attributes: [],
          result_attributes: [],
          facet_attributes: [
            'type',
            { attribute: 'imdbRating', type: 'numeric', field: 'imdbRating' }
          ]
        },
        {
          query: '',
          boostFunctions: [],
          facetAttributesOrder: ['type'],
          pinnedDocs: [],
          userData: [],
          touched: true,
          ruleIds: ['rule1'],
          baseFilters: []
        }
      )
    ).toMatchInlineSnapshot(`
      {
        "type": {
          "terms": {
            "field": "type",
            "size": 10,
          },
        },
      }
    `)
  })
})
