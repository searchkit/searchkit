import { transformFacetFilters } from '../filters'
import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { QueryRule, SearchSettingsConfig } from '@searchkit/core'

const config: SearchSettingsConfig = {
  search_attributes: [],
  result_attributes: [],
  facet_attributes: [
    { attribute: 'band', field: 'band', type: 'string' },
    { attribute: 'marketplace.code', field: 'code', nestedPath: 'marketplace', type: 'string' }
  ]
}

const transform = (facetFilters: any[]) =>
  transformFacetFilters({ indexName: 'index', params: { facetFilters } }, config)

describe('transformFacetFilters', () => {
  describe('values with a leading "-" escaped by InstantSearch', () => {
    it('unescapes a disjunctive facet value', () => {
      expect(transform([['band:\\-10 to 0', 'band:0 to 10']])).toEqual([
        {
          bool: {
            should: [{ term: { band: '-10 to 0' } }, { term: { band: '0 to 10' } }]
          }
        }
      ])
    })

    it('unescapes a conjunctive facet value', () => {
      expect(transform(['band:\\-5'])).toEqual([{ term: { band: '-5' } }])
    })

    it('unescapes a nested facet value', () => {
      expect(transform([['marketplace.code:\\-ABC']])).toEqual([
        {
          bool: {
            should: [
              {
                nested: {
                  inner_hits: {},
                  path: 'marketplace',
                  query: { bool: { should: [{ term: { 'marketplace.code': '-ABC' } }] } }
                }
              }
            ]
          }
        }
      ])
    })

    it('only unescapes the leading "-"', () => {
      expect(transform(['band:\\-1 to \\-5'])).toEqual([{ term: { band: '-1 to \\-5' } }])
    })

    it('passes the unescaped value to a custom filterQuery', () => {
      const filterQuery = jest.fn((field: string, value: string) => ({ match: { [field]: value } }))
      const result = transformFacetFilters(
        { indexName: 'index', params: { facetFilters: ['band:\\-5'] } },
        {
          ...config,
          facet_attributes: [{ attribute: 'band', field: 'band', type: 'string', filterQuery }]
        }
      )
      expect(filterQuery).toHaveBeenCalledWith('band', '-5')
      expect(result).toEqual([{ match: { band: '-5' } }])
    })
  })

  it('matches query rule filter conditions against the unescaped value', () => {
    const rules: QueryRule[] = [
      {
        id: 'negative-band',
        conditions: [
          [{ context: 'filterPresent', values: [{ attribute: 'band', value: '-10 to 0' }] }]
        ],
        actions: [{ action: 'RenderUserData', userData: '{"banner":"cold"}' }]
      }
    ]
    const actionsFor = (facetFilters: any) =>
      getQueryRulesActionsFromRequest(
        rules,
        { indexName: 'index', params: { facetFilters } },
        config
      ).ruleIds

    expect(actionsFor([['band:\\-10 to 0']])).toEqual(['negative-band'])
    expect(actionsFor(['band:\\-10 to 0'])).toEqual(['negative-band'])
    expect(actionsFor('band:\\-10 to 0')).toEqual(['negative-band'])
  })

  it('leaves values without an escaped leading "-" unchanged', () => {
    expect(transform(['band:a-b', 'band:-7', 'band:with:colon'])).toEqual([
      { term: { band: 'a-b' } },
      { term: { band: '-7' } },
      { term: { band: 'with:colon' } }
    ])
  })
})
