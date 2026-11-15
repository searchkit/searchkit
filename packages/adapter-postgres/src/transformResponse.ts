import { getPageDetails, getRenderingContent } from '@searchkit/core'
import type {
  MultipleQueriesQuery,
  QueryRuleActions,
  SearchHit,
  SearchResponse,
  SearchSettingsConfig
} from '@searchkit/core'
import { getHitAttributes, getSnippetAttributes, SCORE_COLUMN } from './sql/query'

/**
 * @description The row returned by the statement for one InstantSearch request: the page of `hits`,
 * the `total` number of matching rows, and `took`, the query time in milliseconds.
 */
export interface PostgresSearchResponse {
  hits: Record<string, unknown>[] | null
  total: number | string | null
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
    facets: {},
    hits: getHits(response, settings, idColumn, index),
    index: request.indexName,
    params: new URLSearchParams(request.params as any).toString(),
    ...(rules.userData.length > 0 ? { userData: rules.userData } : {})
  }
}
