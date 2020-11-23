import SearchkitRequest from '../core/SearchkitRequest'
import { SearchkitConfig, SortingOption } from './ResultsResolver'

export interface HitsParameters {
  page: {
    from: number
    size: number
  }
  sortBy?: string
}

function getSortOptionField(id, sortOptions: SortingOption[]) {
  const selectedSortOption = sortOptions.find((sortOption) => sortOption.id === id)
  if (!selectedSortOption) {
    throw new Error(`Sort Option: sorting option ${id} not found`)
  }
  const sortField = selectedSortOption.field
  return Array.isArray(sortField) ? sortField : [sortField]
}

export default async (parent, parameters: HitsParameters, ctx: { skRequest: SearchkitRequest, config: SearchkitConfig }) => {
  const { skRequest, config } = ctx

  try {
    const from = parameters.page?.from || 0
    const size = parameters.page?.size || 10
    const sortByField = parameters.sortBy
      ? getSortOptionField(parameters.sortBy, config.sortOptions)
      : ['_score']

    const { hits } = await skRequest.search({
      from: from,
      size: size,
      sort: sortByField
    })

    return {
      items: hits.hits.map((hit) => ({
        id: hit._id,
        fields: hit._source
      })),
      page: {
        total: hits.total.value,
        totalPages: Math.ceil(hits.total.value / size),
        pageNumber: from / size,
        from: from,
        size: size
      }
    }
  } catch (e) {
    console.log(e)
  }
}
