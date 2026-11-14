import { transformFacetFilters } from '../filters'
import { getQueryRulesActionsFromRequest } from '../queryRules'
import { AlgoliaMultipleQueriesQuery, QueryRule, SearchSettingsConfig } from '../types'

// InstantSearch sends a facet value that starts with "-" as "\-" (see
// algoliasearch-helper escapeFacetValue), so it is not read as an exclusion.
describe('facet values that start with "-"', () => {
  const config: SearchSettingsConfig = {
    facet_attributes: [
      { attribute: 'band', field: 'band', type: 'string' },
      { attribute: 'size', field: 'size', type: 'string', nestedPath: 'variants' }
    ],
    result_attributes: [],
    search_attributes: []
  }

  const request = (facetFilters: any): AlgoliaMultipleQueriesQuery => ({
    indexName: 'index',
    params: { facetFilters }
  })

  it('unescapes a leading "\\-" in a disjunctive facet filter', () => {
    expect(transformFacetFilters(request([['band:\\-10 to 0', 'band:0 to 10']]), config)).toEqual([
      {
        bool: {
          should: [{ term: { band: '-10 to 0' } }, { term: { band: '0 to 10' } }]
        }
      }
    ])
  })

  it('unescapes a leading "\\-" in a conjunctive facet filter', () => {
    expect(transformFacetFilters(request(['band:\\-5']), config)).toEqual([
      { term: { band: '-5' } }
    ])
  })

  it('unescapes a leading "\\-" in nested facet filters', () => {
    expect(transformFacetFilters(request([['size:\\-1']]), config)).toEqual([
      {
        bool: {
          should: [
            {
              nested: {
                inner_hits: {},
                path: 'variants',
                query: { bool: { should: [{ term: { 'variants.size': '-1' } }] } }
              }
            }
          ]
        }
      }
    ])

    expect(transformFacetFilters(request(['size:\\-1']), config)).toEqual([
      {
        nested: {
          inner_hits: {},
          path: 'variants',
          query: { bool: { should: [{ term: { 'variants.size': '-1' } }] } }
        }
      }
    ])
  })

  it('only unescapes a leading "\\-"', () => {
    expect(
      transformFacetFilters(request([['band:a \\- b', 'band:\\\\-x', 'band:-7']]), config)
    ).toEqual([
      {
        bool: {
          should: [
            { term: { band: 'a \\- b' } },
            { term: { band: '\\\\-x' } },
            { term: { band: '-7' } }
          ]
        }
      }
    ])
  })

  it('matches query rule filterPresent conditions against the unescaped value', () => {
    const rules: QueryRule[] = [
      {
        id: 'cold',
        conditions: [
          [{ context: 'filterPresent', values: [{ attribute: 'band', value: '-10 to 0' }] }]
        ],
        actions: []
      }
    ]

    expect(
      getQueryRulesActionsFromRequest(rules, request([['band:\\-10 to 0']]), config).ruleIds
    ).toEqual(['cold'])
  })
})
