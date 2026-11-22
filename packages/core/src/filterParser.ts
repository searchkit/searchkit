import type { FilterNode, FilterRangeNode } from './filterAst'
import type { FacetAttribute, FilterAttribute, SearchSettingsConfig } from './types'

/**
 * Parser for the `filters` string syntax (the InstantSearch `filters` param and query rule
 * `QueryFilter` / `QueryBoost` queries) into the engine-neutral filter AST.
 *
 * Supported, the documented Lucene-like subset:
 * - `attr:value`, `attr:"quoted value"` (numbers and `true` / `false` are typed)
 * - `attr:[min TO max]` (inclusive) and `attr:{min TO max}` (exclusive), `*` for an open bound
 * - `attr:>n`, `attr:>=n`, `attr:<n`, `attr:<=n`
 * - `AND`, `OR`, `NOT` (upper case) and parentheses; `AND` binds tighter than `OR`
 *
 * Anything else (field-less terms, wildcards, fuzzy / boost operators, implicit operators, ...)
 * throws an error naming the unsupported token.
 */

type FilterSettings = Pick<SearchSettingsConfig, 'facet_attributes' | 'filter_attributes'>

const NUMBER = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/
const UNSUPPORTED_VALUE_CHARS = /[*?~^\\]/

export class FilterParseError extends Error {}

const getAttributeMap = (facets: FacetAttribute[] = [], filters: FilterAttribute[] = []) => {
  const map: Record<string, { nestedPath?: string }> = {}
  for (const f of [...filters, ...facets]) {
    if (typeof f === 'string') {
      map[f] = {}
    } else {
      map[f.attribute] = f
    }
  }
  return map
}

const typedValue = (value: string): string | number | boolean => {
  if (value === 'true') return true
  if (value === 'false') return false
  if (NUMBER.test(value)) return parseFloat(value)
  return value
}

const rangeBound = (value: string): number | string =>
  NUMBER.test(value) ? parseFloat(value) : value

export function parseFilters(input: string, settings?: FilterSettings): FilterNode {
  let pos = 0
  const attributes = settings
    ? getAttributeMap(settings.facet_attributes, settings.filter_attributes)
    : null

  const fail = (message: string): never => {
    throw new FilterParseError(`${message} in filters "${input}"`)
  }

  const unsupported = (token: string): never =>
    fail(`Unsupported filter syntax "${token}" at position ${pos}`)

  const skipWhitespace = () => {
    while (pos < input.length && /\s/.test(input[pos])) pos++
  }

  // the next run of characters up to whitespace or a structural character
  const peekWord = () => {
    const match = input.slice(pos).match(/^[^\s()"\[\]{}]+/)
    return match ? match[0] : ''
  }

  const peekKeyword = (keyword: 'AND' | 'OR' | 'NOT') => {
    skipWhitespace()
    if (!input.startsWith(keyword, pos)) return false
    const next = input[pos + keyword.length]
    return next === undefined || /[\s(]/.test(next)
  }

  const nextToken = () => {
    skipWhitespace()
    if (pos >= input.length) return 'end of input'
    return peekWord() || input[pos]
  }

  const validateAttribute = (attribute: string) => {
    if (!attributes) return
    if (!attributes[attribute]) {
      throw new Error(
        `Attribute "${attribute}" is not defined as an attribute in the facet or filter search settings`
      )
    }
    if (attributes[attribute].nestedPath) {
      throw new Error(
        `Attribute "${attribute}" is a nested field and cannot be used as a filter. Nested fields are supported in facetFilers or numericFilters.`
      )
    }
  }

  const parseQuoted = (): string => {
    // at the opening quote
    pos++
    let value = ''
    while (pos < input.length && input[pos] !== '"') {
      if (input[pos] === '\\' && pos + 1 < input.length) {
        pos++
      }
      value += input[pos]
      pos++
    }
    if (input[pos] !== '"') fail('Unterminated quoted value')
    pos++
    return value
  }

  const parseRange = (attribute: string): FilterNode => {
    const inclusiveStart = input[pos] === '['
    pos++
    skipWhitespace()
    const lower = peekWord()
    if (!lower) unsupported(nextToken())
    pos += lower.length
    skipWhitespace()
    if (!input.startsWith('TO', pos)) unsupported(nextToken())
    pos += 2
    skipWhitespace()
    const upper = peekWord()
    if (!upper) unsupported(nextToken())
    pos += upper.length
    skipWhitespace()
    const end = input[pos]
    if (end !== ']' && end !== '}') unsupported(nextToken())
    const inclusiveEnd = end === ']'
    pos++

    const node: FilterRangeNode = { op: 'range', attribute, raw: {} }
    if (lower !== '*') {
      const key = inclusiveStart ? 'gte' : 'gt'
      node[key] = rangeBound(lower)
      node.raw![key] = lower
    }
    if (upper !== '*') {
      const key = inclusiveEnd ? 'lte' : 'lt'
      node[key] = rangeBound(upper)
      node.raw![key] = upper
    }
    return node
  }

  const parseComparison = (attribute: string): FilterNode => {
    const operator =
      input.startsWith('>=', pos) || input.startsWith('<=', pos)
        ? input.slice(pos, pos + 2)
        : input[pos]
    pos += operator.length
    skipWhitespace()
    const value = peekWord()
    if (!NUMBER.test(value)) unsupported(value || nextToken())
    pos += value.length
    const key = ({ '>': 'gt', '>=': 'gte', '<': 'lt', '<=': 'lte' } as const)[
      operator as '>' | '>=' | '<' | '<='
    ]
    return { op: 'range', attribute, [key]: parseFloat(value), raw: { [key]: value } }
  }

  const parseTerm = (): FilterNode => {
    skipWhitespace()
    const attributeMatch = input.slice(pos).match(/^[\w.][\w.\-]*/)
    if (!attributeMatch || input[pos + attributeMatch[0].length] !== ':') {
      return unsupported(nextToken())
    }
    const attribute = attributeMatch[0]
    validateAttribute(attribute)
    pos += attribute.length + 1

    const char = input[pos]
    if (char === '"') {
      const value = parseQuoted()
      return { op: 'eq', attribute, value, raw: value }
    }
    if (char === '[' || char === '{') {
      return parseRange(attribute)
    }
    if (char === '>' || char === '<') {
      return parseComparison(attribute)
    }
    const value = peekWord()
    if (!value || UNSUPPORTED_VALUE_CHARS.test(value)) {
      return unsupported(value || nextToken())
    }
    pos += value.length
    return { op: 'eq', attribute, value: typedValue(value), raw: value }
  }

  let parseOr: () => FilterNode

  const parseUnary = (): FilterNode => {
    if (peekKeyword('NOT')) {
      pos += 3
      return { op: 'not', node: parseUnary() }
    }
    skipWhitespace()
    if (input[pos] === '(') {
      pos++
      const node = parseOr()
      skipWhitespace()
      if (input[pos] !== ')') unsupported(nextToken())
      pos++
      return node
    }
    return parseTerm()
  }

  const parseAnd = (): FilterNode => {
    const nodes = [parseUnary()]
    while (peekKeyword('AND')) {
      pos += 3
      nodes.push(parseUnary())
    }
    return nodes.length === 1 ? nodes[0] : { op: 'and', nodes }
  }

  parseOr = (): FilterNode => {
    const nodes = [parseAnd()]
    while (peekKeyword('OR')) {
      pos += 2
      nodes.push(parseAnd())
    }
    return nodes.length === 1 ? nodes[0] : { op: 'or', nodes }
  }

  skipWhitespace()
  if (pos >= input.length) fail('Empty filter')
  const ast = parseOr()
  skipWhitespace()
  if (pos < input.length) unsupported(nextToken())
  return ast
}
