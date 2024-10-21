import { getSnippetFieldLength } from './transformRequest'
import type { ElasticsearchHit, SearchSettingsConfig } from './types'

export function highlightTerm(value: string, query: string): string {
  const regex = new RegExp(query, 'gi')
  return value.replace(regex, (match) => `<em>${match}</em>`)
}

export function isAllowableHighlightField(fieldKey: string, highlightFields: string[]) {
  return (
    highlightFields.findIndex((highlightField) => {
      if (highlightField.indexOf('*') < 0) {
        return highlightField === fieldKey
      }

      const safeHighlightField = highlightField.replace(/[.+?^$|\{\}\(\)\[\]\\]/g, '\\$&')
      const regex = new RegExp(`^${safeHighlightField.replace(/\*/g, '.*')}$`)
      return regex.test(fieldKey)
    }) >= 0
  )
}

function transformObject(input: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const key in input) {
    const keys = key.split('.')
    let currentObj = result

    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i]

      if (!currentObj[currentKey]) {
        currentObj[currentKey] = {}
      }

      currentObj = currentObj[currentKey]
    }

    currentObj[keys[keys.length - 1]] = input[key]
  }

  return result
}

/**
 * Retrieves a nested field value from an object using a dot-notation path.
 * If any part of the path points to an array, it maps over the array to extract the values.
 * This function ensures that a property exists, even if its value is `undefined`.
 *
 * @param {object} obj - The object to retrieve the nested value from.
 * @param {string} path - The dot-notation path to the desired value (e.g., 'messages.text').
 * @returns {any} - The value at the specified path, or undefined if the path or property does not exist.
 *                  If the path involves an array, an array of values will be returned.
 */
export function getFieldValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (Array.isArray(acc)) {
      // Map over the array and extract the value
      return acc.map(item => item[key])
    }

    // Check if the property exists before accessing it
    return acc && Object.prototype.hasOwnProperty.call(acc, key)
      ? acc[key]
      : undefined
  }, obj)
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
    const fieldValue: any = getFieldValue(_source, fieldKey)
    const highlightedMatch = highlight[fieldKey] || null

    if (!isAllowableHighlightField(fieldKey, highlightFields)) {
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

  return transformObject(hitHighlights)
}
