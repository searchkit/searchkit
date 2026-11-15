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
import {
  buildFacets,
  DEFAULT_MAX_VALUES_PER_FACET,
  getFacetValuesFacet,
  getRequestedFacets
} from './facets'
import { compileFilter } from './filters'
import { buildHeadlineColumns } from './highlight'
import { Params, quoteColumn, quoteTable } from './identifiers'
import { buildSemanticCtes, getSemanticSearch } from './semantic'

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

/** Options of one statement, from the adapter (not the search settings) */
export interface StatementOptions {
  /** The embedded query, when `semantic_search` applies (not `text_only`, and a non-empty query) */
  queryVector?: number[]
  /** An extra predicate AND-ed into the filters (the `getWhere` request option), `$1` is `params[0]` */
  where?: { text: string; params?: unknown[] }
}

export const DEFAULT_ID_COLUMN = 'id'
export const DEFAULT_TEXT_SEARCH_CONFIG = 'english'

/** Columns of the hits CTE that are not attributes of the hit */
export const SCORE_COLUMN = '_score'
export const ROW_NUMBER_COLUMN = '_rn'
/** Position of a `PinnedResult` document in the pinned ids (null for other rows) */
export const PIN_COLUMN = '_pin'

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
    return {
      orderBy: `${SCORE_COLUMN} DESC, ${id} ASC`,
      sortColumns: [] as string[],
      byRelevance: true
    }
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
  return {
    orderBy: terms.join(', '),
    sortColumns,
    // sorted by score first: query rule pinned results go first, as with an Elasticsearch `pinned` query
    byRelevance:
      options[0].field === SCORE_COLUMN && String(options[0].order).toLowerCase() === 'desc'
  }
}

/**
 * The `_score` expression: the text rank (0 without a query) plus, for each `QueryBoost` rule, its
 * weight when the row matches the rule's filter (`CASE WHEN <predicate> THEN weight ELSE 0 END`).
 */
const getScore = (
  rank: string,
  rules: QueryRuleActions,
  settings: SearchSettingsConfig,
  params: Params
) => {
  if (rules.boosts.length === 0) return `${rank} AS ${SCORE_COLUMN}`
  const boosts = rules.boosts.map((boost) => {
    const weight = Number(boost.weight)
    if (!Number.isFinite(weight)) {
      throw new Error(
        `QueryBoost "${boost.query}": weight must be a number, got ${JSON.stringify(boost.weight)}`
      )
    }
    const predicate = compileFilter(parseFilters(boost.query, settings), settings, params, 't.')
    return `CASE WHEN ${predicate} THEN ${params.add(weight)}::real ELSE 0 END`
  })
  return `(${[rank, ...boosts].join(' + ')})::real AS ${SCORE_COLUMN}`
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
 * `hits` (a JSON array), the `total` number of matching rows and, when facets are requested, the
 * `facets` (see `buildFacets`). A search for facet values request (`facetName`) returns only `facets`.
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
 * With a query and `highlight_attributes` / `snippet_attributes`, each hit also gets `_highlight` and
 * `_snippet` JSON objects built with `ts_headline` over the page of hits only (see `buildHeadlineColumns`).
 * With an empty query there is no text predicate, `_score` is 0 and the default order is by id.
 * Query rules: `QueryRewrite` replaces the query, `QueryFilter` is AND-ed into `WHERE`, each `QueryBoost`
 * adds `CASE WHEN <filter> THEN weight ELSE 0 END` to `_score`, and `PinnedResult` ids match regardless of
 * the query and, when the hits are sorted by relevance, come first in their configured order (`_pin`).
 * The `getWhere` predicate (`options.where`) is AND-ed with the filters.
 *
 * With `semantic_search` (not `text_only`) and a query, `base` holds the candidates ranked by
 * `buildSemanticCtes` instead: in `hybrid` mode the rows that match the text query plus the `k` nearest
 * rows, fused with reciprocal rank fusion (`_score` is the RRF score); in `semantic_only` mode the `k`
 * nearest rows (`_score` is the negated distance). Filters apply inside both searches, and the hits,
 * `total` and facets are computed over the candidates.
 * Identifiers come from the configuration (validated and quoted); every value is a bound parameter.
 */
export const buildSearchStatement = (
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  rules: QueryRuleActions,
  index: PostgresIndexConfig,
  options: StatementOptions = {}
): { text: string; params: unknown[] } => {
  const params = new Params()
  const table = quoteTable(index.table)
  const idColumn = index.id_column || DEFAULT_ID_COLUMN
  const query = (rules.query || '').trim()
  const hasQuery = query !== ''

  const hitAttributes = getHitAttributes(settings)
  const {
    orderBy: sortOrderBy,
    sortColumns,
    byRelevance
  } = getOrderBy(getSortingOption(request, settings), idColumn)

  // a search for facet values request only needs the values of its facet, not hits
  const { facetName, facetQuery, maxValuesPerFacet } = request.params || {}
  const isFacetValuesSearch = !!facetName
  const facets = isFacetValuesSearch
    ? [getFacetValuesFacet(facetName, settings)]
    : getRequestedFacets(request, settings, rules)

  // snippet attributes need not be result attributes; they are only read to build `_snippet`
  const pageColumns = [idColumn, ...hitAttributes, ...getSnippetAttributes(settings)]
  const hitColumns = Array.from(new Set(pageColumns)).map(quoteColumn)
  const baseColumns = Array.from(
    new Set([...pageColumns, ...sortColumns, ...facets.map((f) => f.field)])
  ).map(quoteColumn)

  const semantic = hasQuery ? getSemanticSearch(settings) : undefined
  if (semantic && !options.queryVector) {
    throw new Error('semantic_search: the query vector is missing (embed the query first)')
  }

  const ctes: string[] = []
  const where: string[] = []
  let textMatch: { predicate: string; rank: string } | undefined
  let rank = '0::real'
  let from = `${table} t`
  let configParam = ''
  // `PinnedResult` ids match even when they do not match the query (filters still apply), like an
  // Elasticsearch `pinned` query; when the hits are sorted by relevance they come first, in order
  const { pinnedDocs } = rules
  let pinnedParam = ''
  const addPinnedParam = () => {
    if (pinnedDocs.length > 0) pinnedParam = `${params.add(pinnedDocs)}::text[]`
  }
  const idText = `t.${quoteColumn(idColumn)}::text`

  if (hasQuery) {
    configParam = params.add(index.text_search_config || DEFAULT_TEXT_SEARCH_CONFIG)
    const queryParam = params.add(query)
    addPinnedParam()
    const vector = index.search_vector_column
      ? `t.${quoteColumn(index.search_vector_column)}`
      : `(${getSearchAttributesVector(settings, configParam)})`
    ctes.push(`q AS (SELECT websearch_to_tsquery(${configParam}::regconfig, ${queryParam}) AS tsq)`)
    from = `${table} t CROSS JOIN q`
    rank = `ts_rank_cd(${vector}, q.tsq)`
    textMatch = {
      predicate: pinnedParam
        ? `(${vector} @@ q.tsq OR ${idText} = ANY(${pinnedParam}))`
        : `${vector} @@ q.tsq`,
      rank
    }
    if (semantic) {
      // the candidates and their rank come from the `ranked` CTE (see buildSemanticCtes)
      from = `${table} t JOIN ranked r ON t.${quoteColumn(idColumn)} = r._id`
      rank = 'coalesce(r._rank, 0)::float8'
    } else {
      where.push(textMatch.predicate)
    }
  } else {
    addPinnedParam()
  }

  const score = getScore(rank, rules, settings, params)
  const pinFirst = !!pinnedParam && byRelevance && !isFacetValuesSearch
  const pinColumn = pinFirst ? `, array_position(${pinnedParam}, ${idText}) AS ${PIN_COLUMN}` : ''
  const orderBy = pinFirst ? `${PIN_COLUMN} ASC NULLS LAST, ${sortOrderBy}` : sortOrderBy

  const filters: string[] = []
  const filter = getFilter(request, settings, rules)
  if (filter) {
    filters.push(compileFilter(filter, settings, params, 't.'))
  }
  if (options.where) {
    filters.push(`(${params.addSql(options.where.text, options.where.params)})`)
  }

  if (semantic && options.queryVector) {
    // the filters apply inside the vector and text searches, so `base` needs no WHERE
    ctes.push(
      ...buildSemanticCtes(semantic, {
        params,
        queryVector: options.queryVector,
        table,
        id: quoteColumn(idColumn),
        filters,
        text: textMatch,
        pinnedParam: pinnedParam || undefined
      })
    )
  } else {
    where.push(...filters)
  }

  ctes.push(
    [
      'base AS (',
      `  SELECT ${baseColumns.map((c) => `t.${c}`).join(', ')}, ${score}${pinColumn}`,
      `  FROM ${from}`,
      ...(where.length > 0 ? [`  WHERE ${where.join('\n    AND ')}`] : []),
      ')'
    ].join('\n')
  )

  const select: string[] = []

  if (!isFacetValuesSearch) {
    const { size, from: offset } = getResultsSize(request)
    const limitParam = params.add(Math.max(0, size))
    const offsetParam = params.add(Math.max(0, offset))
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
    // highlights and snippets are computed for the page of hits only
    const headlineColumns = hasQuery
      ? buildHeadlineColumns(request, settings, params, {
          configParam,
          tsquery: 'q.tsq',
          qualifier: 'hits.'
        })
      : []
    const page =
      headlineColumns.length > 0
        ? `(SELECT hits.*, ${headlineColumns.join(', ')} FROM hits CROSS JOIN q)`
        : 'hits'
    select.push(
      `(SELECT coalesce(json_agg(h ORDER BY h.${ROW_NUMBER_COLUMN}), '[]'::json) FROM ${page} h) AS hits`,
      '(SELECT n FROM total) AS total'
    )
  }

  const facetSql = buildFacets(facets, params, {
    size: maxValuesPerFacet || DEFAULT_MAX_VALUES_PER_FACET,
    facetQuery: isFacetValuesSearch ? facetQuery || '' : undefined
  })
  if (facetSql) {
    ctes.push(...facetSql.ctes)
    select.push(`${facetSql.select} AS facets`)
  }

  const text = [`WITH ${ctes.join(',\n')}`, 'SELECT', `  ${select.join(',\n  ')}`].join('\n')

  return { text, params: params.values }
}
