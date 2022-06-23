import type { SearchFieldCollapse } from '@elastic/elasticsearch-types/lib/api/types'
import merge from 'lodash/merge'
import { SearchkitConfig } from '../'
import { BaseFacet } from '../facets'
import QueryManager from './QueryManager'
import { filterTransform } from './FacetsFns'

export interface SearchResponse<T> {
  took: number
  timed_out: boolean
  hits: {
    total: {
      value: number
    }
    max_score: number
    hits: Array<{
      _id: number
      _source: any
      fields?: any
      highlight?: any
      inner_hits?: any
      matched_queries?: string[]
      sort?: string[]
    }>
  }
  aggregations?: any
}

export type Query = {
  bool?: {
    must?: Array<Record<string, unknown>>
    should?: Array<Record<string, unknown>>
    filter?: Array<Record<string, unknown>>
  }
}

export const mergeESQueries = (queries) =>
  merge(
    {
      aggs: {}
    },
    ...queries
  )

export default function RequestBodyBuilder(
  queryManager: QueryManager,
  config: SearchkitConfig,
  baseFilters: Array<Record<string, unknown>>,
  facets: Array<BaseFacet>,
  partialQueries: Array<any>
) {
  const queryFilter =
    queryManager.hasQuery() && config.query ? config.query.getFilter(queryManager) : null

  const baseFiltersQuery = filterTransform(queryManager, config.filters)
  const combinedBaseFilters = [].concat(baseFilters, baseFiltersQuery?.bool?.must || [])
  const query: Query = queryFilter || (combinedBaseFilters.length > 0 ? {} : null)

  if (combinedBaseFilters.length) {
    if (query.bool) {
      Object.assign(query.bool, {
        filter: query.bool.filter?.length
          ? [].concat(query.bool.filter, combinedBaseFilters)
          : combinedBaseFilters
      })
    } else {
      Object.assign(query, { bool: { filter: combinedBaseFilters } })
    }
  }

  const postFilter = filterTransform(queryManager, facets)

  let highlight
  config.hits.highlightedFields?.forEach((field) => {
    if (!highlight) {
      highlight = { fields: {} }
    }
    if (typeof field == 'string') {
      highlight.fields[field] = {}
    } else {
      highlight.fields[field.field] = field.config
    }
  })

  let collapseConfig: SearchFieldCollapse

  if (config.collapse) {
    collapseConfig = {
      field: config.collapse.field,
      inner_hits: config.collapse.inner_hits
    }
  }

  const baseQuery = { size: 0 }
  const sourceFields = {
    _source: {
      includes: config.hits.fields
    }
  }

  return mergeESQueries(
    [
      baseQuery,
      sourceFields,
      query && { query },
      collapseConfig && { collapse: collapseConfig },
      postFilter && { post_filter: postFilter },
      highlight && { highlight },
      ...(partialQueries as any[])
    ].filter(Boolean)
  )
}
