import { getSortingOption } from '@searchkit/core'
import type { AlgoliaMultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'

export function getSorting(request: AlgoliaMultipleQueriesQuery, config: SearchSettingsConfig) {
  const sortOption = getSortingOption(request, config)
  if (!sortOption) return {}

  const buildSortField = (sorting: any) => {
    const fieldPath = sorting.nestedPath ? `${sorting.nestedPath}.${sorting.field}` : sorting.field

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
