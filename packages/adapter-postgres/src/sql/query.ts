import {
  getFilterAst,
  getResultsSize,
  getSnippetFieldLength,
  getSortingOption,
  parseFilters
} from '@searchkit/core'
import type {
  FilterNode,
  MultipleQueriesQuery,
  QueryRuleActions,
  SearchSettingsConfig,
  SortingOption
} from '@searchkit/core'
import { compileFilter } from './filters'
import { Params, quoteColumn, quoteTable } from './identifiers'

/**
 * @description How an InstantSearch `indexName` maps to a table.
 */
export interface PostgresIndexConfig {
  /** The table to search. May be schema-qualified: 'shop.products' */
  table: string
  /** The primary key column, returned as `objectID`. Defaults to 'id' */
  id_column?: string
  /** A precomputed `tsvector` column (recommended, with a GIN index). Without it the text is vectorised at query time from `search_attributes` */
  search_vector_column?: string
  /** The text search configuration (regconfig) used by `websearch_to_tsquery` / `to_tsvector`. Defaults to 'english' */
  text_search_config?: string
}

export const DEFAULT_ID_COLUMN = 'id'
export const DEFAULT_TEXT_SEARCH_CONFIG = 'english'

/** Columns of the hits CTE that are not attributes of the hit */
export const SCORE_COLUMN = '_score'
export const ROW_NUMBER_COLUMN = '_rn'

const WEIGHT_LABELS = ['A', 'B', 'C', 'D'] as const

/**
 * The attributes returned in each hit: `result_attributes` and `highlight_attributes`, like the
 * `_source.includes` of the Elasticsearch adapter.
 */
export const getHitAttributes = (settings: SearchSettingsConfig): string[] =>
  Array.from(
    new Set([...(settings.result_attributes || []), ...(settings.highlight_attributes || [])])
  )

/** `snippet_attributes` without their `:length` suffix */
export const getSnippetAttributes = (settings: SearchSettingsConfig): string[] =>
  (settings.snippet_attributes || []).map((attribute) => getSnippetFieldLength(attribute).attribute)

/**
 * The `tsvector` expression built from `search_attributes` at query time, when the index has no
 * `search_vector_column`. Attributes are weighted A, B, C, D by descending `weight` (default 1);
 * from the fourth distinct weight on, they all get D.
 */
const getSearchAttributesVector = (settings: SearchSettingsConfig, configParam: string) => {
  const attributes = (settings.search_attributes || []).map((attribute) =>
    typeof attribute === 'string'
      ? { field: attribute, weight: 1 }
      : { field: attribute.field, weight: attribute.weight ?? 1 }
  )
  if (attributes.length === 0) {
    throw new Error(
      '@searchkit/adapter-postgres: configure `search_attributes`, or a `search_vector_column` on the index, to search'
    )
  }
  const weights = Array.from(new Set(attributes.map((a) => a.weight))).sort((a, b) => b - a)
  const label = (weight: number) =>
    WEIGHT_LABELS[Math.min(weights.indexOf(weight), WEIGHT_LABELS.length - 1)]

  return attributes
    .map(
      ({ field, weight }) =>
        `setweight(to_tsvector(${configParam}::regconfig, coalesce(t.${quoteColumn(
          field
        )}::text, '')), '${label(weight)}')`
    )
    .join(' || ')
}

const getOrderBy = (sorting: SortingOption | SortingOption[] | undefined, idColumn: string) => {
  const id = quoteColumn(idColumn)
  if (!sorting) {
    return { orderBy: `${SCORE_COLUMN} DESC, ${id} ASC`, sortColumns: [] as string[] }
  }
  const options = Array.isArray(sorting) ? sorting : [sorting]
  const sortColumns: string[] = []
  const terms = options.map((option) => {
    if (option.nestedPath || option.mode) {
      throw new Error(
        `Sorting option on "${option.field}": nestedPath and mode are not supported by the postgres adapter`
      )
    }
    const order = String(option.order).toLowerCase()
    if (order !== 'asc' && order !== 'desc') {
      throw new Error(
        `Sorting option on "${option.field}": order must be 'asc' or 'desc', got "${option.order}"`
      )
    }
    if (option.field === SCORE_COLUMN) {
      return `${SCORE_COLUMN} ${order.toUpperCase()}`
    }
    sortColumns.push(option.field)
    // missing values sort last in both directions, as in Elasticsearch
    return `${quoteColumn(option.field)} ${order.toUpperCase()} NULLS LAST`
  })
  // the id breaks ties, so pagination is deterministic
  if (!options.some((option) => option.field === idColumn)) {
    terms.push(`${id} ASC`)
  }
  return { orderBy: terms.join(', '), sortColumns }
}

/** The request filters (`facetFilters`, `numericFilters`, `filters`, geo) and `QueryFilter` rules, AND-ed */
const getFilter = (
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  rules: QueryRuleActions
): FilterNode | null => {
  const nodes: FilterNode[] = []
  const requestFilter = getFilterAst(request, settings)
  if (requestFilter) nodes.push(requestFilter)
  for (const filter of rules.filters) nodes.push(parseFilters(filter, settings))
  if (nodes.length === 0) return null
  return nodes.length === 1 ? nodes[0] : { op: 'and', nodes }
}

/**
 * Builds the parameterised statement for one InstantSearch search request: one row with the page of
 * `hits` (a JSON array) and the `total` number of matching rows.
 *
 * ```sql
 * WITH q AS (SELECT websearch_to_tsquery($1::regconfig, $2) AS tsq),
 * base AS (
 *   SELECT t."id", t."name", ts_rank_cd(t."search_vector", q.tsq) AS _score
 *   FROM "products" t CROSS JOIN q
 *   WHERE t."search_vector" @@ q.tsq AND <filters>
 * ),
 * hits AS (SELECT ..., row_number() OVER (ORDER BY _score DESC, "id" ASC) AS _rn FROM base
 *          ORDER BY _score DESC, "id" ASC LIMIT $3 OFFSET $4),
 * total AS (SELECT count(*) AS n FROM base)
 * SELECT (SELECT coalesce(json_agg(h ORDER BY h._rn), '[]'::json) FROM hits h) AS hits,
 *        (SELECT n FROM total) AS total
 * ```
 *
 * With an empty query there is no text predicate, `_score` is 0 and the default order is by id.
 * Identifiers come from the configuration (validated and quoted); every value is a bound parameter.
 */
export const buildSearchStatement = (
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  rules: QueryRuleActions,
  index: PostgresIndexConfig
): { text: string; params: unknown[] } => {
  const params = new Params()
  const table = quoteTable(index.table)
  const idColumn = index.id_column || DEFAULT_ID_COLUMN
  const query = (rules.query || '').trim()
  const hasQuery = query !== ''

  const hitAttributes = getHitAttributes(settings)
  const { orderBy, sortColumns } = getOrderBy(getSortingOption(request, settings), idColumn)

  const hitColumns = Array.from(new Set([idColumn, ...hitAttributes])).map(quoteColumn)
  const baseColumns = Array.from(new Set([idColumn, ...hitAttributes, ...sortColumns])).map(
    quoteColumn
  )

  const ctes: string[] = []
  const where: string[] = []
  let score = `0::real AS ${SCORE_COLUMN}`
  let from = `${table} t`

  if (hasQuery) {
    const configParam = params.add(index.text_search_config || DEFAULT_TEXT_SEARCH_CONFIG)
    const queryParam = params.add(query)
    const vector = index.search_vector_column
      ? `t.${quoteColumn(index.search_vector_column)}`
      : `(${getSearchAttributesVector(settings, configParam)})`
    ctes.push(`q AS (SELECT websearch_to_tsquery(${configParam}::regconfig, ${queryParam}) AS tsq)`)
    from = `${table} t CROSS JOIN q`
    score = `ts_rank_cd(${vector}, q.tsq) AS ${SCORE_COLUMN}`
    where.push(`${vector} @@ q.tsq`)
  }

  const filter = getFilter(request, settings, rules)
  if (filter) {
    where.push(compileFilter(filter, settings, params, 't.'))
  }

  const { size, from: offset } = getResultsSize(request)
  const limitParam = params.add(Math.max(0, size))
  const offsetParam = params.add(Math.max(0, offset))

  ctes.push(
    [
      'base AS (',
      `  SELECT ${baseColumns.map((c) => `t.${c}`).join(', ')}, ${score}`,
      `  FROM ${from}`,
      ...(where.length > 0 ? [`  WHERE ${where.join('\n    AND ')}`] : []),
      ')'
    ].join('\n')
  )
  ctes.push(
    [
      'hits AS (',
      `  SELECT ${hitColumns.join(
        ', '
      )}, ${SCORE_COLUMN}, row_number() OVER (ORDER BY ${orderBy}) AS ${ROW_NUMBER_COLUMN}`,
      '  FROM base',
      `  ORDER BY ${orderBy}`,
      `  LIMIT ${limitParam} OFFSET ${offsetParam}`,
      ')'
    ].join('\n')
  )
  ctes.push('total AS (SELECT count(*) AS n FROM base)')

  const text = [
    `WITH ${ctes.join(',\n')}`,
    'SELECT',
    `  (SELECT coalesce(json_agg(h ORDER BY h.${ROW_NUMBER_COLUMN}), '[]'::json) FROM hits h) AS hits,`,
    '  (SELECT n FROM total) AS total'
  ].join('\n')

  return { text, params: params.values }
}
