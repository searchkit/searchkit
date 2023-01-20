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

    if (Array.isArray(sortOption)) {
      return {
        sort: sortOption.map((sorting) => {
          return {
            [sorting.field]: sorting.order
          }
        })
      }
    } else {
      return {
        sort: {
          [sortOption.field]: sortOption.order
        }
      }
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
