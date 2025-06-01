import { SearchSettingsConfig } from './types'
import { AlgoliaMultipleQueriesQuery } from './types'

export function getSorting(request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) {
  if (config.sorting && Object.keys(config.sorting).length > 0) {
    const selectedSorting = Object.keys(config.sorting).find((key) => {
      if (request.indexName.endsWith(key)) {
        return true
      }
    })

    if (!selectedSorting && !config.sorting.default) return {}

    const sortOption = selectedSorting ? config.sorting[selectedSorting] : config.sorting.default

    const buildSortField = (sorting: any) => {
      const fieldPath = sorting.nestedPath
        ? `${sorting.nestedPath}.${sorting.field}`
        : sorting.field

      if (sorting.nestedPath) {
        const sortConfig: any = {
          order: sorting.order,
          nested: {
            path: sorting.nestedPath
          }
        }
        
        // Add mode if specified
        if (sorting.mode) {
          sortConfig.mode = sorting.mode
        }
        
        return {
          [fieldPath]: sortConfig
        }
      }

      const sortConfig: any = sorting.order
      
      // For non-nested fields, if mode is specified, create an object instead of just the order string
      if (sorting.mode) {
        return {
          [fieldPath]: {
            order: sorting.order,
            mode: sorting.mode
          }
        }
      }

      return {
        [fieldPath]: sortConfig
      }
    }

    return {
      sort: Array.isArray(sortOption) ? sortOption.map(buildSortField) : buildSortField(sortOption)
    }
  }
  return {}
}

export function getIndexName(indexName: string, config: SearchSettingsConfig) {
  if (config.sorting && Object.keys(config.sorting).length > 0) {
    const selectedSorting = Object.keys(config.sorting).find((key) => {
      if (indexName.endsWith(key)) {
        return true
      }
    })

    if (selectedSorting) {
      return indexName.replace(selectedSorting, '')
    }
  }
  return indexName
}
