import { transformRequest } from '../transformRequest'
import type { SearchSettingsConfig } from '../types'

const config: SearchSettingsConfig = {
  search_attributes: [],
  result_attributes: [],
  facet_attributes: [
    {
      attribute: 'companyPreferences.industry',
      field: 'industry.keyword',
      nestedPath: 'companyPreferences',
      type: 'string'
    },
    {
      attribute: 'companyPreferences.stage',
      field: 'stage.keyword',
      nestedPath: 'companyPreferences',
      type: 'string'
    },
    {
      attribute: 'companyPreferences.size',
      field: 'size',
      nestedPath: 'companyPreferences',
      type: 'numeric'
    }
  ]
}

const emptyActions = {
  touched: false,
  query: '',
  baseFilters: [],
  pinnedDocs: [],
  userData: [],
  ruleIds: [],
  facetAttributesOrder: undefined
} as any

// Elasticsearch uses the nested path as the inner_hits name when none is set,
// and rejects a query where two inner_hits share a name.
const innerHitsNames = (filters: any[]): string[] =>
  filters.flatMap((filter) => {
    if (filter.nested) return [filter.nested.inner_hits.name ?? filter.nested.path]
    if (filter.bool?.should) return innerHitsNames(filter.bool.should)
    return []
  })

const getFilters = (params: Record<string, any>) =>
  (transformRequest({ indexName: 'index', params }, config, emptyActions).query as any).bool.filter

describe('inner_hits names for nested filters', () => {
  it('are unique when two facets on the same nested path are refined', () => {
    const filters = getFilters({
      facetFilters: [
        ['companyPreferences.industry:AI'],
        ['companyPreferences.stage:Early Stage Venture']
      ]
    })

    expect(innerHitsNames(filters)).toEqual(['companyPreferences', 'companyPreferences_2'])
  })

  it('are unique when a facet and a numeric filter share a nested path', () => {
    const filters = getFilters({
      facetFilters: [['companyPreferences.industry:AI']],
      numericFilters: ['companyPreferences.size>=10']
    })

    expect(innerHitsNames(filters)).toEqual(['companyPreferences', 'companyPreferences_2'])
  })

  it('are unique for conjunctive values of one nested facet', () => {
    const filters = getFilters({
      facetFilters: ['companyPreferences.industry:AI', 'companyPreferences.industry:Fintech']
    })

    expect(innerHitsNames(filters)).toEqual(['companyPreferences', 'companyPreferences_2'])
  })

  it('keeps the default name when the path is used once', () => {
    const filters = getFilters({
      facetFilters: [['companyPreferences.industry:AI', 'companyPreferences.stage:Seed']]
    })

    expect(filters[0].bool.should[0].nested.inner_hits).toEqual({})
  })
})
