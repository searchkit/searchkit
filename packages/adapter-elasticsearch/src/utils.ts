import type { SearchRequest } from '@searchkit/core'

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
