/**
 * `@searchkit/core`: the engine-neutral part of Searchkit, shared by the search engine adapters
 * (`@searchkit/adapter-elasticsearch`, `@searchkit/adapter-postgres`) and the `searchkit` package.
 *
 * - the search settings, InstantSearch request / response types and the `SearchAdapter` interface
 * - the filter AST, the `filters` string parser and the InstantSearch param -> AST builders
 * - query rule evaluation, sorting option lookup, pagination maths and facet helpers
 *
 * Browser safe, with no runtime dependencies. The Elasticsearch-typed escape hatches (`getQuery`,
 * `CustomFacetConfig`, hooks, ...) only use types, which are inlined into the published declarations.
 */
export * from './types'
export * from './filterAst'
export { parseFilters, FilterParseError } from './filterParser'
export {
  getFilterAst,
  getFacetFilterMap,
  getFacetFiltersAst,
  getGeoFiltersAst,
  getNumericFiltersAst,
  parseFacetFilter,
  transformQueryString
} from './filters'
export { getQueryRulesActionsFromRequest, getSatisfiedRules } from './queryRules'
export type {
  QueryContext,
  QueryContextFilter,
  QueryRuleActions,
  QueryRuleBoost
} from './queryRules'
export { getIndexName, getSortingOption } from './sorting'
export { getHitsPerPage, getPageDetails, getRenderingContent, getResultsSize } from './response'
export {
  getFacet,
  getFacetAttribute,
  getFacetByAttribute,
  getFacetField,
  getFacetFieldConfig,
  getFacetFieldType,
  getSnippetFieldLength,
  isNestedFacet
} from './utils'
