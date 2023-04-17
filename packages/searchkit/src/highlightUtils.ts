import { getSnippetFieldLength } from './transformRequest'
import type { ElasticsearchHit, SearchSettingsConfig } from './types'

export function highlightTerm(value: string, query: string): string {
  const regex = new RegExp(query, 'gi')
  return value.replace(regex, (match) => `<em>${match}</em>`)
}

export function getHighlightFields(
  hit: ElasticsearchHit,
  preTag: string = '<ais-highlight-0000000000>',
  postTag: string = '<ais-highlight-0000000000/>',
  fields: SearchSettingsConfig['snippet_attributes'] = []
) {
  const { _source = {}, highlight = {} } = hit

  const combinedKeys = {
    ..._source,
    ...highlight
  }

  const highlightFields = fields.map((field) => getSnippetFieldLength(field).attribute)

  const hitHighlights = Object.keys(combinedKeys).reduce<Record<string, any>>((sum, fieldKey) => {
    const fieldValue: any = _source[fieldKey]
    const highlightedMatch = highlight[fieldKey] || null

    if (!highlightFields.includes(fieldKey) && highlightFields[0] !== '*') {
      return sum
    }
    // no matches, specified as a highlight and value is an array
    if (Array.isArray(fieldValue) && !highlightedMatch) {
      return {
        ...sum,
        [fieldKey]: fieldValue.map((value) => ({
          matchLevel: 'none',
          matchedWords: [],
          value: value.toString()
        }))
      }
      // field array and has multiple highlighted matches
    } else if (Array.isArray(fieldValue) && highlightedMatch && Array.isArray(highlightedMatch)) {
      return {
        ...sum,
        [fieldKey]: highlightedMatch.map((highlightedMatch) => {
          const matchWords = Array.from(highlightedMatch.matchAll(/\<em\>(.*?)\<\/em\>/g)).map(
            (match) => match[1]
          )
          return {
            fullyHighlighted: false,
            matchLevel: 'full',
            matchedWords: matchWords,
            value: highlightedMatch
              .toString()
              .replace(/\<em\>/g, preTag)
              .replace(/\<\/em\>/g, postTag)
          }
        })
      }
    } else if (
      (!Array.isArray(fieldValue) && highlightedMatch && Array.isArray(highlightedMatch)) ||
      (!fieldValue && Array.isArray(highlightedMatch) && highlightedMatch.length > 0)
    ) {
      const singleMatch = highlightedMatch[0]

      const matchWords = Array.from(singleMatch.matchAll(/\<em\>(.*?)\<\/em\>/g)).map(
        (match) => match[1]
      )
      const x = {
        fullyHighlighted: false,
        matchLevel: 'full',
        matchedWords: matchWords,
        value: singleMatch
          .toString()
          .replace(/\<em\>/g, preTag)
          .replace(/\<\/em\>/g, postTag)
      }

      return {
        ...sum,
        [fieldKey]: x
      }
    }

    return {
      ...sum,
      [fieldKey]: {
        matchLevel: 'none',
        matchedWords: [],
        value: fieldValue != undefined ? fieldValue.toString() : ''
      }
    }
  }, {})

  return hitHighlights
}
