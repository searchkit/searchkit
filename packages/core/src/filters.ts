import type {
  AlgoliaMultipleQueriesQuery,
  FacetAttribute,
  SearchSettingsConfig,
  FilterAttribute,
  FacetFieldConfig
} from './types'
import type { FilterNode, FilterRangeNode } from './filterAst'
import { parseFilters } from './filterParser'

/**
 * InstantSearch (via algoliasearch-helper's `escapeFacetValue`) escapes a leading
 * `-` in a facet value as `\-` so it is not read as a facet exclusion. Reverse
 * that so the original value reaches the engine's filter clause and query rules.
 */
const unescapeFacetValue = (value: string) => value.replace(/^\\-/, '-')

/** Splits an InstantSearch `facetFilters` entry (`attribute:value`) into its parts. */
export const parseFacetFilter = (filter: string): [string, string] => {
  const [facet, value] = filter.split(/:(.*)/)
  return [facet, value && unescapeFacetValue(value)]
}

/**
 * Maps every filterable attribute (facet and filter attributes) to its configuration.
 * Adapters use it to resolve the attribute of a filter AST node to its field.
 */
export const getFacetFilterMap = (facets: FacetAttribute[], filters: FilterAttribute[]) => {
  return [...filters, ...facets].reduce<Record<string, FacetFieldConfig | FilterAttribute>>(
    (sum, filter) => {
      let f: FacetFieldConfig | FilterAttribute =
        typeof filter === 'string' ? { attribute: filter, field: filter, type: 'string' } : filter

      return {
        ...sum,
        [f.attribute]: f
      }
    },
    {}
  )
}

/**
 * Validates the attributes used in a `filters` / query rule string and maps them to their fields.
 * Throws when an attribute is not configured, or is a nested field.
 */
export const transformQueryString = (
  facets: FacetAttribute[] = [],
  filters: FilterAttribute[] = [],
  queryString: string
) => {
  const regex = /([\w\.\-]+)\:/gi
  const filterMap = getFacetFilterMap(facets, filters)
  return queryString.replace(regex, (match: string, word: string) => {
    if (!filterMap[word]) {
      throw new Error(
        `Attribute "${word}" is not defined as an attribute in the facet or filter search settings`
      )
    }

    if (!!filterMap[word].nestedPath) {
      throw new Error(
        `Attribute "${word}" is a nested field and cannot be used as a filter. Nested fields are supported in facetFilers or numericFilters.`
      )
    }

    return filterMap[word].field + ':'
  })
}

/**
 * `facetFilters` as filter AST nodes, one per top level entry (they are AND-ed).
 * A string entry becomes an `eq` node; an array entry (a disjunctive facet) becomes an `or` node.
 */
export const getFacetFiltersAst = (request: AlgoliaMultipleQueriesQuery): FilterNode[] => {
  const { params = {} } = request
  const { facetFilters } = params

  if (!Array.isArray(facetFilters)) {
    return []
  }

  const toEq = (filter: string): FilterNode => {
    const [attribute, value] = parseFacetFilter(filter)
    return { op: 'eq', attribute, value }
  }

  return facetFilters.reduce<FilterNode[]>((sum, filter) => {
    if (Array.isArray(filter)) {
      return [...sum, { op: 'or', nodes: filter.map(toEq) }]
    } else if (typeof filter === 'string') {
      return [...sum, toEq(filter)]
    }
    return sum
  }, [])
}

const parseNumber = (value: string) => parseFloat(value)

/** `numericFilters` as filter AST nodes, one per entry (they are AND-ed). */
export const getNumericFiltersAst = (request: AlgoliaMultipleQueriesQuery): FilterNode[] => {
  const { params = {} } = request
  const { numericFilters } = params

  if (!Array.isArray(numericFilters)) {
    return []
  }

  return numericFilters.map((filter: string): FilterNode => {
    let match,
      attribute,
      operator,
      value,
      maxValue = ''
    let groups = filter.match(
      /([\w\.\_\-]+)\s*(\=|\!\=|\>|\>\=|\<|\<\=)\s*(-?(?:\d+(?:\.\d*)?|\.\d+))/
    )

    if (groups) {
      ;[match, attribute, operator, value] = groups
    } else {
      // Alternative syntax: 'attribute:lower_value TO higher_value'
      groups = filter.match(
        /([\w\.\_\-]+):\s*(-?(?:\d+(?:\.\d*)?|\.\d+))\s*([Tt][Oo])\s*(-?(?:\d+(?:\.\d*)?|\.\d+))/
      )

      if (!groups) {
        throw new Error(
          `Numeric filter "${filter}" could not be parsed. It should either be in the format "attributeName operator operand" or "attributeName: lowerBound TO upperBound"`
        )
      }

      ;[match, attribute, value, operator, maxValue] = groups
    }

    if (operator === '=') {
      return { op: 'eq', attribute, value: parseNumber(value), raw: value }
    } else if (operator === '!=') {
      return { op: 'not', node: { op: 'eq', attribute, value: parseNumber(value), raw: value } }
    }

    const range: FilterRangeNode = { op: 'range', attribute, raw: {} }
    if (operator === '>') {
      range.gt = parseNumber(value)
      range.raw = { gt: value }
    } else if (operator === '>=') {
      range.gte = parseNumber(value)
      range.raw = { gte: value }
    } else if (operator === '<') {
      range.lt = parseNumber(value)
      range.raw = { lt: value }
    } else if (operator === '<=') {
      range.lte = parseNumber(value)
      range.raw = { lte: value }
    } else {
      // TO
      range.gte = parseNumber(value)
      range.lte = parseNumber(maxValue)
      range.raw = { gte: value, lte: maxValue }
    }
    return range
  })
}

/**
 * Geo params (`insideBoundingBox`, else `aroundLatLng` / `aroundRadius`) as filter AST nodes.
 * Only applies when `geo_attribute` is configured; the node attribute is `geo_attribute`.
 */
export const getGeoFiltersAst = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): FilterNode[] => {
  if (!config.geo_attribute) {
    return []
  }
  const attribute = config.geo_attribute
  const { params = {} } = request
  const { aroundLatLng, aroundRadius, insideBoundingBox } = params

  const toBox = (box: readonly (string | number)[]): FilterNode => {
    const [top, left, bottom, right] = box.map((v) => parseFloat(String(v)))
    return { op: 'geo_bbox', attribute, box: [top, left, bottom, right] }
  }

  if (insideBoundingBox) {
    if (typeof insideBoundingBox === 'string') {
      return [toBox(insideBoundingBox.split(','))]
    } else if (Array.isArray(insideBoundingBox)) {
      return [{ op: 'or', nodes: insideBoundingBox.map(toBox) }]
    }
    return []
  }

  if (aroundLatLng) {
    const [lat, lng] = aroundLatLng.split(',')

    return [
      {
        op: 'geo_distance',
        attribute,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radius: aroundRadius,
        raw: { lat, lng }
      }
    ]
  }

  return []
}

/**
 * All the filters of an InstantSearch request (`facetFilters`, `numericFilters`, `filters` and
 * geo params) as one AST, or null when the request has no filters. The `filters` string is
 * parsed with `parseFilters`, so this throws on syntax that parser does not support.
 */
export const getFilterAst = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): FilterNode | null => {
  const filters = request.params?.filters
  const nodes = [
    ...getFacetFiltersAst(request),
    ...getNumericFiltersAst(request),
    ...(filters ? [parseFilters(filters, config)] : []),
    ...getGeoFiltersAst(request, config)
  ]
  if (nodes.length === 0) return null
  return { op: 'and', nodes }
}
