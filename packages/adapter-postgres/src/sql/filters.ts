import { getFacetFilterMap } from '@searchkit/core'
import type { FilterNode, SearchSettingsConfig } from '@searchkit/core'
import { Params, quoteColumn } from './identifiers'

type FilterSettings = Pick<SearchSettingsConfig, 'facet_attributes' | 'filter_attributes'>

/**
 * Compiles a filter AST node into a SQL predicate. Columns come from the facet / filter attribute
 * configuration (validated and quoted); every value is added to `params` as a bound parameter.
 *
 * Scalar columns only for now: `array: true` attributes (`= ANY`, `@>`, `&&`) come with facets.
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

  const column = (attribute: string) => {
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
    return qualifier + quoteColumn(config.field)
  }

  const compile = (node: FilterNode): string => {
    switch (node.op) {
      case 'and':
        return node.nodes.length === 0 ? 'TRUE' : `(${node.nodes.map(compile).join(' AND ')})`
      case 'or':
        return node.nodes.length === 0 ? 'FALSE' : `(${node.nodes.map(compile).join(' OR ')})`
      case 'not':
        // like an Elasticsearch must_not, rows where the predicate is NULL (missing value) match
        return `NOT coalesce(${compile(node.node)}, false)`
      case 'eq':
        return `${column(node.attribute)} = ${params.add(node.value)}`
      case 'in':
        return `${column(node.attribute)} = ANY(${params.add(node.values)})`
      case 'range': {
        const col = column(node.attribute)
        const bounds = (
          [
            ['gte', '>='],
            ['gt', '>'],
            ['lte', '<='],
            ['lt', '<']
          ] as const
        )
          .filter(([key]) => node[key] !== undefined)
          .map(([key, operator]) => `${col} ${operator} ${params.add(node[key])}`)
        return bounds.length === 0 ? `${col} IS NOT NULL` : `(${bounds.join(' AND ')})`
      }
      case 'exists':
        return `${column(node.attribute)} IS NOT NULL`
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
