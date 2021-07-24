import { BaseFacet } from '../BaseFacet'
import QueryManager, { ValueFilter } from '../../core/QueryManager'

export class VisibleWhenRuleSet {
  constructor(private facets: Array<BaseFacet>, private rules: Array<any>) {}

  getActiveFacets(queryManager: QueryManager, ctx): Array<BaseFacet> {
    const rulesSatisfied = this.rules.filter((rule) => rule(queryManager, ctx))
    return rulesSatisfied.length === this.rules.length ? this.facets : []
  }
}

export function VisibleWhen(facets: Array<BaseFacet>, rules: Array<any>): VisibleWhenRuleSet {
  return new VisibleWhenRuleSet(facets, rules)
}

export function FacetSelectedRule(identifier: string, value?: string) {
  return (queryManager: QueryManager) => {
    const identifierFilters = queryManager.getFiltersById(identifier) as Array<ValueFilter>
    if (!identifierFilters) return false
    if (!value) return true
    if (value) {
      return !!identifierFilters.find((filter) => filter.value === value)
    }
  }
}
