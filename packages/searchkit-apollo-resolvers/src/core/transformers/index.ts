import QueryManager from '../QueryManager'
import { BaseFacet } from '../../facets/BaseFacet'

export const filterTransform = (queryManager: QueryManager, facets: Array<BaseFacet> = []) => {
  const subFilters = facets.reduce((subFilters, facet) => {
    const facetSubFilter = queryManager.getFilterById(facet.getId())
    if (facetSubFilter) {
      return {
        ...subFilters,
        ...facet.getFilter(facetSubFilter)
      }
    }
    return subFilters
  }, [])
  if (subFilters.length === 1) {
    return subFilters
  }
  return {
    bool: {
      must: subFilters
    }
  }
}
