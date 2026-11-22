import type { SearchSettingsConfig, SemanticSearchConfig } from '@searchkit/core'
import { Params, quoteColumn } from './identifiers'

/** Default number of nearest neighbours, as in the Elasticsearch adapter */
export const DEFAULT_K = 50

/** The rank constant of reciprocal rank fusion (the Elasticsearch `rank.rrf` default) */
export const RRF_RANK_CONSTANT = 60

/** pgvector distance operators: smaller is closer for all three (`<#>` is the negative inner product) */
export const DISTANCE_OPERATORS = {
  cosine: '<=>',
  l2: '<->',
  inner_product: '<#>'
} as const

export type SemanticDistance = keyof typeof DISTANCE_OPERATORS

/** `semantic_search` settings validated for the postgres adapter */
export interface ResolvedSemanticSearch {
  /** the vector column (validated, not quoted) */
  field: string
  embed: (query: string) => Promise<number[]> | number[]
  k: number
  distance: SemanticDistance
  mode: 'hybrid' | 'semantic_only'
}

const MODES: NonNullable<SemanticSearchConfig['mode']>[] = ['hybrid', 'semantic_only', 'text_only']

/**
 * The `semantic_search` settings in effect for the postgres adapter: undefined when they are not set
 * or in `text_only` mode (the vector is ignored, `embed` is never called). Throws on settings the
 * adapter cannot run, e.g. `model_id`, which is Elasticsearch only.
 */
export const getSemanticSearch = (
  settings: SearchSettingsConfig
): ResolvedSemanticSearch | undefined => {
  const semantic = settings.semantic_search
  if (!semantic) return undefined

  const mode = semantic.mode ?? 'hybrid'
  if (!MODES.includes(mode)) {
    throw new Error(
      `semantic_search: unknown mode "${mode}". Use 'hybrid', 'semantic_only' or 'text_only'`
    )
  }
  if (mode === 'text_only') return undefined

  if (!semantic.field) {
    throw new Error('semantic_search: `field` is required')
  }
  quoteColumn(semantic.field)
  if (semantic.model_id !== undefined) {
    throw new Error(
      'semantic_search: `model_id` (server-side inference) is Elasticsearch only. The postgres adapter needs `embed`, a function that returns the query vector, e.g. `embed: async (query) => embedText(query)`'
    )
  }
  if (typeof semantic.embed !== 'function') {
    throw new Error(
      'semantic_search: the postgres adapter needs `embed`, a function that returns the query vector (number[])'
    )
  }
  const distance = semantic.distance ?? 'cosine'
  if (!(distance in DISTANCE_OPERATORS)) {
    throw new Error(
      `semantic_search: unknown distance "${distance}". Use 'cosine', 'l2' or 'inner_product'`
    )
  }
  const k = semantic.k ?? DEFAULT_K
  if (!Number.isInteger(k) || k < 1) {
    throw new Error(`semantic_search: \`k\` must be a positive integer, got ${JSON.stringify(k)}`)
  }
  return { field: semantic.field, embed: semantic.embed, k, distance, mode }
}

/**
 * The pgvector text form of a query vector (`[0.1,0.2,...]`), bound as a parameter and cast to `vector`.
 * `pg` would send a JS array as a Postgres array (`{...}`), which `vector` does not parse.
 */
export const toVectorLiteral = (vector: unknown): string => {
  if (
    !Array.isArray(vector) ||
    vector.length === 0 ||
    !vector.every((v) => typeof v === 'number' && Number.isFinite(v))
  ) {
    throw new Error(
      'semantic_search: `embed` must return a non-empty array of finite numbers (the query vector)'
    )
  }
  return `[${vector.join(',')}]`
}

/**
 * The CTEs that rank the candidate rows of a semantic search, ending with `ranked (_id, _rank)`:
 *
 * - `nearest`: the `k` rows closest to the query vector, among the rows that match the filters (the
 *   filters are applied inside the vector search, so it never returns rows the filters exclude).
 * - hybrid: `text_ranked` numbers the rows that match the text query (and the filters) by text rank,
 *   and `ranked` fuses both lists with reciprocal rank fusion: `sum(1 / (60 + rank))` per row. A row
 *   found by either search is a candidate; one found by both ranks higher.
 * - semantic_only: `ranked` is `nearest`, with `_rank` the negated distance (higher is closer).
 *
 * `PinnedResult` ids are candidates too (through the text predicate in hybrid mode, and with a null
 * `_rank` in semantic_only mode), so they match regardless of the query, as without semantic search.
 */
export const buildSemanticCtes = (
  semantic: ResolvedSemanticSearch,
  options: {
    params: Params
    queryVector: number[]
    /** the quoted table */
    table: string
    /** the quoted id column */
    id: string
    /** the predicates every candidate must match (filters, `getWhere`), on alias `t` */
    filters: string[]
    /** hybrid: the text match predicate (with the pinned ids) and the text rank expression */
    text?: { predicate: string; rank: string }
    /** semantic_only: the pinned ids parameter (`$n::text[]`), when there are pinned results */
    pinnedParam?: string
  }
): string[] => {
  const { params, table, id, filters } = options
  const vectorParam = `${params.add(toVectorLiteral(options.queryVector))}::vector`
  const kParam = params.add(semantic.k)
  const distance = `t.${quoteColumn(semantic.field)} ${
    DISTANCE_OPERATORS[semantic.distance]
  } ${vectorParam}`
  const where = (predicates: string[]) =>
    predicates.length > 0 ? [`  WHERE ${predicates.join('\n    AND ')}`] : []

  const ctes = [
    [
      'nearest AS (',
      `  SELECT t.${id} AS _id, ${distance} AS _distance`,
      `  FROM ${table} t`,
      ...where([`t.${quoteColumn(semantic.field)} IS NOT NULL`, ...filters]),
      // order by the distance expression itself, so a pgvector (HNSW / IVFFlat) index can be used
      `  ORDER BY ${distance}`,
      `  LIMIT ${kParam}`,
      ')'
    ].join('\n')
  ]

  if (semantic.mode === 'hybrid') {
    if (!options.text) throw new Error('semantic_search: hybrid mode needs the text query')
    ctes.push(
      [
        'text_ranked AS (',
        `  SELECT t.${id} AS _id, row_number() OVER (ORDER BY ${options.text.rank} DESC, t.${id} ASC) AS _r`,
        `  FROM ${table} t CROSS JOIN q`,
        ...where([options.text.predicate, ...filters]),
        ')'
      ].join('\n'),
      [
        'ranked AS (',
        `  SELECT _id, sum(1.0 / (${RRF_RANK_CONSTANT} + _r)) AS _rank`,
        '  FROM (',
        '    SELECT _id, _r FROM text_ranked',
        '    UNION ALL',
        '    SELECT _id, row_number() OVER (ORDER BY _distance ASC, _id ASC) AS _r FROM nearest',
        '  ) u',
        '  GROUP BY _id',
        ')'
      ].join('\n')
    )
    return ctes
  }

  ctes.push(
    options.pinnedParam
      ? [
          'ranked AS (',
          '  SELECT _id, max(_rank) AS _rank',
          '  FROM (',
          '    SELECT _id, -_distance AS _rank FROM nearest',
          '    UNION ALL',
          `    SELECT t.${id} AS _id, NULL::float8 AS _rank FROM ${table} t`,
          `    WHERE ${[`t.${id}::text = ANY(${options.pinnedParam})`, ...filters].join(
            '\n      AND '
          )}`,
          '  ) u',
          '  GROUP BY _id',
          ')'
        ].join('\n')
      : 'ranked AS (SELECT _id, -_distance AS _rank FROM nearest)'
  )
  return ctes
}
