import { getFacetFilterMap } from '@searchkit/core'
import type { FilterNode, FilterRangeNode, SearchSettingsConfig } from '@searchkit/core'
import { Params, quoteColumn } from './identifiers'

type FilterSettings = Pick<SearchSettingsConfig, 'facet_attributes' | 'filter_attributes'>

/**
 * Compiles a filter AST node into a SQL predicate. Columns come from the facet / filter attribute
 * configuration (validated and quoted); every value is added to `params` as a bound parameter.
 *
 * Scalar columns use `=`, `= ANY`, comparisons and `IS NOT NULL`. Attributes marked `array: true`
 * use array operators, so a row matches when any of its values does (like a term / terms / range
 * query on a multi-valued Elasticsearch field): `@>` for one value, `&&` for several, an `EXISTS`
 * over `unnest` for a range, and a non-empty array for `exists`.
 */
export const compileFilter = (
  node: FilterNode,
  settings: FilterSettings,
  params: Params,
  qualifier = ''
): string => {
  const filterMap = getFacetFilterMap(
    settings.facet_attributes || [],
    settings.filter_attributes || []
  )

  const resolve = (attribute: string) => {
    const config = filterMap[attribute]
    if (!config) {
      throw new Error(
        `Attribute "${attribute}" is not defined as an attribute in the facet or filter search settings`
      )
    }
    if (config.nestedPath) {
      throw new Error(
        `Attribute "${attribute}" is a nested field: nested fields are not supported by the postgres adapter`
      )
    }
    if ('filterQuery' in config && config.filterQuery) {
      throw new Error(
        `Attribute "${attribute}" has a custom filterQuery: custom filter queries are Elasticsearch only and not supported by the postgres adapter`
      )
    }
    return { column: qualifier + quoteColumn(config.field), array: !!config.array }
  }

  const compileBounds = (node: FilterRangeNode, column: string) =>
    (
      [
        ['gte', '>='],
        ['gt', '>'],
        ['lte', '<='],
        ['lt', '<']
      ] as const
    )
      .filter(([key]) => node[key] !== undefined)
      .map(([key, operator]) => `${column} ${operator} ${params.add(node[key])}`)

  const compile = (node: FilterNode): string => {
    switch (node.op) {
      case 'and':
        return node.nodes.length === 0 ? 'TRUE' : `(${node.nodes.map(compile).join(' AND ')})`
      case 'or':
        return node.nodes.length === 0 ? 'FALSE' : `(${node.nodes.map(compile).join(' OR ')})`
      case 'not':
        // like an Elasticsearch must_not, rows where the predicate is NULL (missing value) match
        return `NOT coalesce(${compile(node.node)}, false)`
      case 'eq': {
        const { column, array } = resolve(node.attribute)
        // `@>` (contains) can use a GIN index on the array column
        return array
          ? `${column} @> ${params.add([node.value])}`
          : `${column} = ${params.add(node.value)}`
      }
      case 'in': {
        const { column, array } = resolve(node.attribute)
        return array
          ? `${column} && ${params.add(node.values)}`
          : `${column} = ANY(${params.add(node.values)})`
      }
      case 'range': {
        const { column, array } = resolve(node.attribute)
        if (array) {
          const bounds = compileBounds(node, '_v.value')
          return `EXISTS (SELECT 1 FROM unnest(${column}) AS _v(value) WHERE ${
            bounds.length === 0 ? '_v.value IS NOT NULL' : bounds.join(' AND ')
          })`
        }
        const bounds = compileBounds(node, column)
        return bounds.length === 0 ? `${column} IS NOT NULL` : `(${bounds.join(' AND ')})`
      }
      case 'exists': {
        const { column, array } = resolve(node.attribute)
        // an empty array has no value, as in Elasticsearch
        return array ? `cardinality(${column}) > 0` : `${column} IS NOT NULL`
      }
      case 'geo_distance':
      case 'geo_bbox':
        throw new Error(
          `Geo filters (${node.op} on "${node.attribute}") are not supported by the postgres adapter`
        )
      default:
        throw new Error(
          `Unknown filter node ${JSON.stringify(node)}: not supported by the postgres adapter`
        )
    }
  }

  return compile(node)
}
