import { getFacet } from '@searchkit/core'
import type {
  FacetAttribute,
  FacetValueOrder,
  MultipleQueriesQuery,
  QueryRuleActions,
  SearchSettingsConfig
} from '@searchkit/core'
import { Params, quoteColumn } from './identifiers'

/** The default number of values per facet, as in the Elasticsearch adapter */
export const DEFAULT_MAX_VALUES_PER_FACET = 10

/** A facet attribute resolved for SQL */
export interface ResolvedFacet {
  attribute: string
  /** the column (validated, not quoted) */
  field: string
  type: 'string' | 'numeric'
  array: boolean
  /** `count` (default): most common values first; `alpha`: by value, ascending */
  order: FacetValueOrder
}

const resolveFacet = (facet: FacetAttribute): ResolvedFacet | null => {
  if (typeof facet === 'string') {
    return { attribute: facet, field: facet, type: 'string', array: false, order: 'count' }
  }
  if ('facetQuery' in facet) {
    throw new Error(
      `Facet "${facet.attribute}" has a custom facetQuery: custom facets are Elasticsearch only and not supported by the postgres adapter`
    )
  }
  if (facet.nestedPath) {
    throw new Error(
      `Facet "${facet.attribute}" is a nested field: nested fields are not supported by the postgres adapter`
    )
  }
  // like the Elasticsearch adapter, only string and numeric facets are aggregated
  if (facet.type !== 'string' && facet.type !== 'numeric') return null
  return {
    attribute: facet.attribute,
    field: facet.field,
    type: facet.type,
    array: 'array' in facet && !!facet.array,
    order: 'order' in facet && facet.order === 'alpha' ? 'alpha' : 'count'
  }
}

const notNull = <T>(value: T | null): value is T => value !== null

/**
 * The facets to compute for a search request, in order, following the Elasticsearch adapter:
 * `facets: ['*']` is every facet attribute (or, when a `RenderFacetsOrder` rule matched, the
 * facets it lists, in its order); an explicit list (or a single string) is looked up in
 * `facet_attributes`, unknown attributes are ignored.
 */
export const getRequestedFacets = (
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  rules: QueryRuleActions
): ResolvedFacet[] => {
  const { facets } = request.params || {}
  const facetAttributes = settings.facet_attributes || []
  const lookup = (attribute: string) => getFacet(facetAttributes, attribute)

  let selected: (FacetAttribute | null)[] = []
  if (Array.isArray(facets)) {
    if (facets[0] === '*') {
      selected = rules.facetAttributesOrder
        ? rules.facetAttributesOrder.map(lookup)
        : facetAttributes
    } else {
      selected = facets.map(lookup)
    }
  } else if (typeof facets === 'string') {
    selected = [lookup(facets)]
  }

  const resolved = selected.filter(notNull).map(resolveFacet).filter(notNull)
  // a facet requested twice is computed once
  return resolved.filter(
    (facet, i) => resolved.findIndex((f) => f.attribute === facet.attribute) === i
  )
}

/**
 * The facet of a search for facet values request (`facetName`), or an error when it is not a
 * configured string / numeric facet.
 */
export const getFacetValuesFacet = (
  facetName: string,
  settings: SearchSettingsConfig
): ResolvedFacet => {
  const facet = getFacet(settings.facet_attributes || [], facetName)
  const resolved = facet && resolveFacet(facet)
  if (!resolved) {
    throw new Error(
      `Facet "${facetName}" is not a string or numeric facet in facet_attributes: cannot search its values`
    )
  }
  return resolved
}

/**
 * Escapes `\`, `%` and `_` for a `LIKE` pattern (with the default `\` escape character), so the
 * facet query is matched literally, like the escaped regex of the Elasticsearch adapter.
 */
export const escapeLike = (value: string) => value.replace(/[\\%_]/g, '\\$&')

/**
 * The `ILIKE` patterns of a facet query, matching the Elasticsearch adapter's `include` regex:
 * the value starts with the query, or (for a query longer than two characters) a later word does.
 * Case-insensitive.
 */
export const getFacetQueryPatterns = (facetQuery: string): string[] => {
  const escaped = escapeLike(facetQuery)
  return facetQuery.length > 2 ? [`${escaped}%`, `% ${escaped}%`] : [`${escaped}%`]
}

/**
 * The SQL for the requested facets, over the `base` CTE (the matching rows):
 *
 * - one `GROUP BY` CTE per facet with its top values and their counts (count desc, then value asc,
 *   up to `maxValuesPerFacet`); an `array: true` column is unnested first, counting a row once per
 *   distinct value
 * - for a numeric facet, a stats CTE (`min`, `max`, `avg`, `sum`)
 * - `select`: an expression for one JSON array of `{ attribute, entries: [{ value, count }], stats }`,
 *   in the order of `facets` (`stats` is null for a string facet)
 *
 * With `facetQuery` (search for facet values), the values are filtered with a case-insensitive
 * `ILIKE` (see `getFacetQueryPatterns`) and no stats are computed.
 */
export const buildFacets = (
  facets: ResolvedFacet[],
  params: Params,
  { size, facetQuery }: { size: number; facetQuery?: string }
): { ctes: string[]; select: string } | null => {
  if (facets.length === 0) return null

  const sizeParam = params.add(Math.max(0, size))
  const patternParams =
    facetQuery !== undefined ? getFacetQueryPatterns(facetQuery).map((p) => params.add(p)) : []

  const ctes: string[] = []
  const rows: string[] = []

  facets.forEach((facet, i) => {
    const column = quoteColumn(facet.field)
    const name = `facet_${i}`
    // ordered like Elasticsearch terms buckets: by count, then by value (bytewise for strings, like
    // a keyword field); `order: 'alpha'` orders by value only, like `order: { _key: 'asc' }`
    const order = (alias: string, count: string) => {
      const byValue = `${alias}.value${facet.type === 'numeric' ? '' : '::text COLLATE "C"'} ASC`
      return facet.order === 'alpha' ? byValue : `${count} DESC, ${byValue}`
    }

    // an array column counts a row once per distinct value
    const source = facet.array
      ? `base CROSS JOIN LATERAL (SELECT DISTINCT _u.value FROM unnest(base.${column}) AS _u(value) WHERE _u.value IS NOT NULL) _f`
      : `(SELECT base.${column} AS value FROM base WHERE base.${column} IS NOT NULL) _f`

    ctes.push(
      [
        `${name} AS (`,
        '  SELECT _f.value, count(*) AS count',
        `  FROM ${source}`,
        ...(patternParams.length > 0
          ? [`  WHERE ${patternParams.map((p) => `_f.value::text ILIKE ${p}`).join(' OR ')}`]
          : []),
        '  GROUP BY _f.value',
        `  ORDER BY ${order('_f', 'count(*)')}`,
        `  LIMIT ${sizeParam}`,
        ')'
      ].join('\n')
    )

    let stats = 'NULL::json'
    if (facet.type === 'numeric' && facetQuery === undefined) {
      const values = facet.array
        ? `base CROSS JOIN LATERAL unnest(base.${column}) AS _s(value)`
        : `(SELECT base.${column} AS value FROM base) _s`
      ctes.push(
        [
          `${name}_stats AS (`,
          '  SELECT min(_s.value)::float8 AS min, max(_s.value)::float8 AS max, avg(_s.value)::float8 AS avg, coalesce(sum(_s.value), 0)::float8 AS sum',
          `  FROM ${values}`,
          ')'
        ].join('\n')
      )
      stats = `(SELECT row_to_json(s) FROM ${name}_stats s)`
    }

    const entries = `(SELECT coalesce(json_agg(json_build_object('value', f.value, 'count', f.count) ORDER BY ${order(
      'f',
      'f.count'
    )}), '[]'::json) FROM ${name} f)`
    rows.push(
      `(${i}, json_build_object('attribute', ${params.add(
        facet.attribute
      )}::text, 'entries', ${entries}, 'stats', ${stats}))`
    )
  })

  return {
    ctes,
    select: `(SELECT json_agg(_facets.facet ORDER BY _facets.ord) FROM (VALUES\n    ${rows.join(
      ',\n    '
    )}\n  ) AS _facets(ord, facet))`
  }
}
