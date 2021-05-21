import SearchkitRequest from '../core/SearchkitRequest'
import { SearchkitConfig, SortingOption } from './ResultsResolver'

export interface HitsParameters {
  page: {
    from: number
    size: number
  }
  sortBy?: string
}

function getSortOption(id, sortOptions: SortingOption[]) {
  const selectedSortOption = sortOptions.find((sortOption) => sortOption.id === id)
  if (!selectedSortOption) {
    throw new Error(`Sort Option: sorting option ${id} not found`)
  }
  return selectedSortOption
}

export default async (parent, parameters: HitsParameters, ctx) => {
  const typeName = parent.searchkit.typeName
  const config: SearchkitConfig = parent.searchkit.config
  const skRequest: SearchkitRequest = parent.searchkit.skRequest
  try {
    const from = parameters.page?.from || 0
    const size = parameters.page?.size || 10
    const defaultSortOption = config.sortOptions.find((so) => so.defaultOption)

    const chosenSortOption = parameters.sortBy
      ? getSortOption(parameters.sortBy, config.sortOptions)
      : defaultSortOption

    const { hits } = await skRequest.search({
      from: from,
      size: size,
      sort: chosenSortOption ? chosenSortOption.field : [{ _score: 'desc' }]
    })

    const hitsTotal = (typeof hits.total.value === 'number'
      ? hits.total.value
      : hits.total) as number

    return {
      items: hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source,
        type: parent.searchkit.hitType,
        highlight: hit.highlight,
        rawHit: hit
      })),
      page: {
        total: hitsTotal,
        totalPages: Math.ceil(hitsTotal / size),
        pageNumber: from / size,
        from: from,
        size: size
      },
      sortedBy: chosenSortOption?.id
    }
  } catch (e) {
    console.log(e)
  }
}
