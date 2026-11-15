import { getFacetFilterMap, getSnippetFieldLength } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'
import { Params, quoteColumn } from './identifiers'

/** The tags InstantSearch expects when the request does not send its own (as in the Elasticsearch adapter) */
export const DEFAULT_HIGHLIGHT_PRE_TAG = '<ais-highlight-0000000000>'
export const DEFAULT_HIGHLIGHT_POST_TAG = '</ais-highlight-0000000000>'

/** The JSON objects (attribute -> `ts_headline` output) added to each hit */
export const HIGHLIGHT_COLUMN = '_highlight'
export const SNIPPET_COLUMN = '_snippet'

/**
 * Average characters per word (with its space) in the text, used to turn a snippet length in characters
 * (`description:200`, the Elasticsearch `fragment_size`) into the `MaxWords` of `ts_headline`.
 */
const CHARACTERS_PER_WORD = 6

export const getHighlightTags = (request: MultipleQueriesQuery) => ({
  preTag: request.params?.highlightPreTag || DEFAULT_HIGHLIGHT_PRE_TAG,
  postTag: request.params?.highlightPostTag || DEFAULT_HIGHLIGHT_POST_TAG
})

/** A `ts_headline` option value, double-quoted so tags may contain `,`, `=`, spaces or quotes */
const optionValue = (value: string) => `"${value.replace(/"/g, '""')}"`

/**
 * The `ts_headline` options for a snippet of about `length` characters. The Elasticsearch adapter
 * returns the first fragment of `fragment_size` characters, so this asks for one fragment of
 * `length / 6` words (at least 2). Without a match `ts_headline` would return the first `MinWords`
 * words; the response then uses the plain value instead, as the Elasticsearch adapter does.
 */
export const getSnippetOptions = (length: number) => {
  const maxWords = Math.max(2, Math.round(length / CHARACTERS_PER_WORD))
  const minWords = Math.max(1, Math.floor(maxWords / 2))
  return `MaxFragments=1,MaxWords=${maxWords},MinWords=${minWords}`
}

const getOptions = (preTag: string, postTag: string, options: string) =>
  `StartSel=${optionValue(preTag)},StopSel=${optionValue(postTag)},${options}`

/**
 * The `_highlight` and `_snippet` columns of the page of hits: for each `highlight_attributes` /
 * `snippet_attributes` column, its `ts_headline` with the request's highlight tags. Highlights mark
 * every match in the whole value (`HighlightAll=true`, like `number_of_fragments: 0`); snippets are
 * one fragment of about the configured length. An `array: true` attribute is highlighted per value.
 *
 * Runs over the page of hits only (`FROM hits CROSS JOIN q`), never over every matching row.
 * Returns no columns without a query (there is nothing to highlight).
 */
export const buildHeadlineColumns = (
  request: MultipleQueriesQuery,
  settings: SearchSettingsConfig,
  params: Params,
  { configParam, tsquery, qualifier }: { configParam: string; tsquery: string; qualifier: string }
): string[] => {
  const highlightAttributes = settings.highlight_attributes || []
  const snippets = (settings.snippet_attributes || []).map(getSnippetFieldLength)
  if (highlightAttributes.length === 0 && snippets.length === 0) return []

  const { preTag, postTag } = getHighlightTags(request)
  const filterMap = getFacetFilterMap(
    settings.facet_attributes || [],
    settings.filter_attributes || []
  )
  const isArray = (attribute: string) =>
    Object.values(filterMap).some((config) => config.array && config.field === attribute)

  const headline = (attribute: string, optionsParam: string) => {
    const column = `${qualifier}${quoteColumn(attribute)}`
    const call = (value: string) =>
      `ts_headline(${configParam}::regconfig, coalesce(${value}::text, ''), ${tsquery}, ${optionsParam})`
    return isArray(attribute)
      ? `(SELECT array_agg(${call(
          '_e.value'
        )} ORDER BY _e.n) FROM unnest(${column}) WITH ORDINALITY AS _e(value, n))`
      : call(column)
  }

  const object = (entries: [string, string][]) =>
    `json_build_object(${entries
      .map(([attribute, expression]) => `${params.add(attribute)}::text, ${expression}`)
      .join(', ')})`

  const columns: string[] = []
  if (highlightAttributes.length > 0) {
    const optionsParam = params.add(getOptions(preTag, postTag, 'HighlightAll=true'))
    columns.push(
      `${object(
        highlightAttributes.map((attribute) => [attribute, headline(attribute, optionsParam)])
      )} AS ${HIGHLIGHT_COLUMN}`
    )
  }
  if (snippets.length > 0) {
    // one options parameter per distinct length
    const optionsParams = new Map<number, string>()
    const optionsParam = (length: number) => {
      if (!optionsParams.has(length)) {
        optionsParams.set(
          length,
          params.add(getOptions(preTag, postTag, getSnippetOptions(length)))
        )
      }
      return optionsParams.get(length) as string
    }
    columns.push(
      `${object(
        snippets.map(({ attribute, length }) => [
          attribute,
          headline(attribute, optionsParam(length))
        ])
      )} AS ${SNIPPET_COLUMN}`
    )
  }
  return columns
}
