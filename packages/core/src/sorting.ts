import { SearchSettingsConfig, SortingOption } from './types'
import { AlgoliaMultipleQueriesQuery } from './types'

/**
 * The sorting option selected by the request's `indexName` suffix (see `search_settings.sorting`),
 * else the `default` option, else undefined (sort by relevance).
 */
export function getSortingOption(
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): SortingOption | SortingOption[] | undefined {
  if (config.sorting && Object.keys(config.sorting).length > 0) {
    const selectedSorting = Object.keys(config.sorting).find((key) => {
      if (request.indexName.endsWith(key)) {
        return true
      }
    })

    if (!selectedSorting && !config.sorting.default) return undefined

    return selectedSorting ? config.sorting[selectedSorting] : config.sorting.default
  }
  return undefined
}

/**
 * The index to search for an InstantSearch `indexName`: a sorting suffix configured in
 * `search_settings.sorting` (e.g. `products_price_asc` with a `_price_asc` option) is removed.
 */
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
