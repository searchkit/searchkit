import { CustomFacetConfig, FacetAttribute, FacetFieldConfig, SearchRequest } from './types'

// The terms aggregation `include` uses Lucene regex syntax, where & # @ ~ < > and " are
// operators too. Lucene reads a backslash before any character as that literal character.
export const createRegexQuery = (queryString: string) => {
  let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|&#@~<>"]/g, '\\$&')
  query = query
    .split('')
    .map((char) => {
      if (/[a-z]/i.test(char)) {
        return `[${char.toLowerCase()}${char.toUpperCase()}]`
      }
      return char
    })
    .join('')
  query = `${query}.*`
  if (queryString.length > 2) {
    // Match the start of any word: the start of the value, or right after a space.
    // Any text may come before that space, e.g. "Mendoza, " or "Müller, ".
    query = `(.* )?${query}`
  }
  return query
}

export const getFacet = (
  facet_attributes: FacetAttribute[],
  attributeName: string
): FacetAttribute | null => {
  const f = facet_attributes.find((a) => {
    if (typeof a === 'string') {
      return a === attributeName
    }
    return a.attribute === attributeName
  })
  return f || null
}

export const isNestedFacet = (facet: FacetAttribute): boolean => {
  return typeof facet !== 'string' && !!facet.nestedPath
}

export const getFacetField = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): string => {
  const attributeKey = typeof attribute === 'string' ? attribute : attribute.attribute

  if (facet_attributes.includes(attributeKey)) {
    return attributeKey
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a.attribute === attributeKey)?.field || attributeKey
  )
}

export const getFacetByAttribute = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): string => {
  const attributeKey = getFacetAttribute(attribute)

  if (facet_attributes.includes(attributeKey)) {
    return attributeKey
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a.attribute === attributeKey)?.attribute || attributeKey
  )
}

export const getFacetAttribute = (facetAttribute: FacetAttribute): string => {
  return typeof facetAttribute === 'string' ? facetAttribute : facetAttribute.attribute
}

export const getFacetFieldType = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): FacetFieldConfig['type'] => {
  const attributeKey = typeof attribute === 'string' ? attribute : attribute.attribute

  if (facet_attributes.includes(attributeKey)) {
    return 'string'
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a?.attribute === attributeKey)?.type || 'string'
  )
}

export const getFacetFieldConfig = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): FacetFieldConfig | CustomFacetConfig | undefined => {
  return facet_attributes.find((a) => {
    if (typeof a === 'string') {
      return false
    }
    return a.attribute === attribute
  }) as FacetFieldConfig | CustomFacetConfig | undefined
}

export const createElasticsearchQueryFromRequest = (requests: SearchRequest[]) => {
  return requests
    .reduce<string[]>(
      (sum, request) => [
        ...sum,
        JSON.stringify({ index: request.indexName }),
        '\n',
        JSON.stringify(request.body),
        '\n'
      ],
      []
    )
    .join('')
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

// Recursively merges two plain objects into a new object, without mutating either.
// Arrays are concatenated; any other value from `source` replaces the one in `target`.
// Keys that could pollute a prototype are skipped.
export const deepMerge = <T>(target: T, source: unknown): T => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source] as T
  }
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source as T
  }
  const result: Record<string, unknown> = { ...target }
  for (const key of Object.keys(source)) {
    if (UNSAFE_KEYS.has(key)) continue
    result[key] = Object.prototype.hasOwnProperty.call(result, key)
      ? deepMerge(result[key], source[key])
      : source[key]
  }
  return result as T
}
