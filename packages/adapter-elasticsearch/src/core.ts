/**
 * The engine-neutral core this adapter builds on (settings and request types, query rule actions,
 * filter AST, facet / sorting / pagination helpers) lives in `packages/searchkit`.
 *
 * `searchkit` depends on this package (it re-exports `ElasticsearchAdapter` and builds the default
 * adapter from `connection`), so this package cannot depend on `searchkit` without a dependency
 * cycle. Instead it imports the core sources directly and tsup bundles them into this package's
 * build. The types are structurally identical to the ones `searchkit` exports.
 *
 * Keep every import of the core in this file. The core must never import this package.
 */
export type {
  AlgoliaMultipleQueriesQuery,
  AppSettings,
  BasicAuth,
  ConfigConnection,
  CustomFacetConfig,
  ElasticsearchHit,
  ElasticsearchQuery,
  ElasticsearchResponseBody,
  ElasticsearchSearchRequest,
  FacetAttribute,
  FacetFieldConfig,
  FacetStringResponse,
  FacetsStats,
  FilterAttribute,
  KnnSearchQuery,
  QueryConfig,
  QueryRule,
  RequestOptions,
  SearchAdapter,
  SearchAttribute,
  SearchForFacetValuesResponse,
  SearchRequest,
  SearchResponse,
  SearchSettingsConfig,
  SemanticSearchConfig,
  SortingOption,
  Transporter
} from '../../searchkit/src/types'
export type { FilterNode } from '../../searchkit/src/filterAst'
export type { QueryRuleActions } from '../../searchkit/src/queryRules'
export {
  getFacetFilterMap,
  getFacetFiltersAst,
  getGeoFiltersAst,
  getNumericFiltersAst,
  transformQueryString
} from '../../searchkit/src/filters'
export {
  getFacet,
  getFacetFieldConfig,
  getFacetFieldType,
  getSnippetFieldLength,
  isNestedFacet
} from '../../searchkit/src/utils'
export { getIndexName, getSortingOption } from '../../searchkit/src/sorting'
export {
  getHitsPerPage,
  getPageDetails,
  getRenderingContent,
  getResultsSize
} from '../../searchkit/src/response'
