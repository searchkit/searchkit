import { getPageDetails, getRenderingContent } from '@searchkit/core'
import type {
  MultipleQueriesQuery,
  QueryRuleActions,
  SearchForFacetValuesResponse,
  SearchHit,
  SearchResponse,
  SearchSettingsConfig
} from '@searchkit/core'
import { getHitAttributes, getSnippetAttributes, SCORE_COLUMN } from './sql/query'

/**
 * @description The values of one facet in a `PostgresSearchResponse`: its top values with their
 * counts, in order, and for a numeric facet its `stats` (null otherwise).
 */
export interface PostgresFacetResult {
  attribute: string
  entries: { value: string | number | boolean; count: number | string }[]
  stats: {
    min: number | null
    max: number | null
    avg: number | null
    sum: number | null
  } | null
}

/**
 * @description The row returned by the statement for one InstantSearch request: the page of `hits`,
 * the `total` number of matching rows, the requested `facets` (absent when none were requested) and
 * `took`, the query time in milliseconds. A search for facet values request returns only `facets`.
 */
export interface PostgresSearchResponse {
  hits?: Record<string, unknown>[] | null
  total?: number | string | null
  facets?: PostgresFacetResult[] | null
  took?: number
  [column: string]: unknown
}

type MatchResult = { matchLevel: 'none'; matchedWords: string[]; value: string }

const noMatch = (value: unknown): MatchResult | MatchResult[] =>
  Array.isArray(value)
    ? value.map((v) => ({
        matchLevel: 'none',
        matchedWords: [],
        value: v == null ? '' : String(v)
      }))
    : { matchLevel: 'none', matchedWords: [], value: value == null ? '' : String(value) }

/**
 * `_highlightResult` / `_snippetResult` for the attributes of a hit, in the shape the Elasticsearch
 * adapter returns when nothing matched: the plain value with `matchLevel: 'none'`.
 */
const getMatchResults = (row: Record<string, unknown>, attributes: string[]) =>
  attributes.reduce<Record<string, MatchResult | MatchResult[]>>((sum, attribute) => {
    if (!(attribute in row)) return sum
    return { ...sum, [attribute]: noMatch(row[attribute]) }
  }, {})

export const getHits = (
  response: PostgresSearchResponse,
  settings: SearchSettingsConfig,
  idColumn: string,
  index: string
): SearchHit[] => {
  const hitAttributes = getHitAttributes(settings)
  const { highlight_attributes = [] } = settings
  const snippetAttributes = getSnippetAttributes(settings)

  return (response.hits || []).map((row) => {
    const source = hitAttributes.reduce<Record<string, unknown>>((sum, attribute) => {
      if (attribute in row) sum[attribute] = row[attribute]
      return sum
    }, {})

    return {
      objectID: String(row[idColumn]),
      _index: index,
      _score: Number(row[SCORE_COLUMN] ?? 0),
      ...source,
      ...(highlight_attributes.length > 0
        ? { _highlightResult: getMatchResults(source, highlight_attributes) }
        : {}),
      ...(snippetAttributes.length > 0
        ? { _snippetResult: getMatchResults(source, snippetAttributes) }
        : {})
    }
  })
}

const toNumber = (value: unknown): number | null => (value == null ? null : Number(value))

/**
 * `facets` and `facets_stats` in the shape of the Elasticsearch adapter: `facets` maps each
 * requested facet to `{ value: count }` (values in count order) and `facets_stats` each numeric
 * facet to `{ min, avg, max, sum }`. Both are absent when no facets were requested.
 */
export const getFacets = (
  response: PostgresSearchResponse
): Pick<SearchResponse, 'facets' | 'facets_stats'> => {
  if (!response.facets) return {}
  return response.facets.reduce<Required<Pick<SearchResponse, 'facets' | 'facets_stats'>>>(
    (sum, facet) => {
      sum.facets[facet.attribute] = facet.entries.reduce<Record<string, number>>(
        (values, entry) => {
          values[String(entry.value)] = Number(entry.count)
          return values
        },
        {}
      )
      if (facet.stats) {
        sum.facets_stats[facet.attribute] = {
          min: toNumber(facet.stats.min),
          avg: toNumber(facet.stats.avg),
          max: toNumber(facet.stats.max),
          sum: toNumber(facet.stats.sum)
        }
      }
      return sum
    },
    { facets: {}, facets_stats: {} }
  )
}

/** The facet search highlight of the Elasticsearch adapter: every case-insensitive match of the query */
const highlightFacetValue = (value: string, query: string, preTag: string, postTag: string) => {
  if (!query) return value
  const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return value.replace(regex, (match) => `${preTag}${match}${postTag}`)
}

/**
 * The response to a search for facet values (`facetName` / `facetQuery`) request, in the shape of
 * the Elasticsearch adapter.
 */
export const transformFacetValuesResponse = (
  response: PostgresSearchResponse,
  request: MultipleQueriesQuery
): SearchForFacetValuesResponse => {
  const { facetQuery = '', highlightPreTag, highlightPostTag } = request.params || {}
  const preTag = highlightPreTag || '<ais-highlight-0000000000>'
  const postTag = highlightPostTag || '</ais-highlight-0000000000>'
  const [facet] = response.facets || []

  return {
    facetHits: (facet?.entries || []).map((entry) => {
      const value = String(entry.value)
      return {
        value,
        highlighted: highlightFacetValue(value, facetQuery, preTag, postTag),
        count: Number(entry.count)
      }
    }),
    exhaustiveFacetsCount: true,
    processingTimeMS: response.took ?? 0
  }
}

export const transformResponse = (
  response: PostgresSearchResponse,
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  rules: QueryRuleActions,
  { idColumn, index }: { idColumn: string; index: string }
): SearchResponse => {
  const nbHits = Number(response.total ?? 0)
  const { hitsPerPage, page, nbPages } = getPageDetails(request, nbHits)

  return {
    appliedRules: rules.ruleIds,
    exhaustiveNbHits: true,
    exhaustiveFacetsCount: true,
    exhaustiveTypo: true,
    exhaustive: { facetsCount: true, nbHits: true, typo: true },
    hitsPerPage,
    processingTimeMS: response.took ?? 0,
    nbHits,
    page,
    nbPages,
    query: rules.query,
    ...getRenderingContent(settings, rules),
    ...getFacets(response),
    hits: getHits(response, settings, idColumn, index),
    index: request.indexName,
    params: new URLSearchParams(request.params as any).toString(),
    ...(rules.userData.length > 0 ? { userData: rules.userData } : {})
  }
}
