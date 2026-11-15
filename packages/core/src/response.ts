import type { QueryRuleActions } from './queryRules'
import type { AlgoliaMultipleQueriesQuery, SearchResponse, SearchSettingsConfig } from './types'

/** The requested page size (`hitsPerPage`, default 20). */
export const getHitsPerPage = (request: AlgoliaMultipleQueriesQuery) => {
  const { params = {} } = request
  return params.hitsPerPage == null ? 20 : params.hitsPerPage
}

/** The page of hits to fetch: `size` hits starting at offset `from`. */
export const getResultsSize = (request: AlgoliaMultipleQueriesQuery) => {
  const { params = {} } = request
  const hitsPerPage = getHitsPerPage(request)

  return {
    size: hitsPerPage,
    from: (params.page || 0) * hitsPerPage
  }
}

/** Pagination details of an InstantSearch response, given the total number of hits. */
export const getPageDetails = (
  request: AlgoliaMultipleQueriesQuery,
  totalHits: number | undefined
) => {
  const { params = {} } = request
  const { hitsPerPage = 20, page = 0 } = params

  const nbPages = hitsPerPage <= 0 ? 0 : Math.ceil((totalHits || 0) / hitsPerPage)

  return {
    hitsPerPage,
    page,
    nbPages
  }
}

/** The `renderingContent` of an InstantSearch response: facet ordering, from the settings and query rules. */
export const getRenderingContent = (
  config: SearchSettingsConfig,
  queryRuleActions: QueryRuleActions
): Pick<SearchResponse, 'renderingContent'> => {
  const defaultOrder = config.facet_attributes?.map((facet) =>
    typeof facet === 'string' ? facet : facet.attribute
  )

  return {
    renderingContent: {
      facetOrdering: {
        facets: {
          order: queryRuleActions.facetAttributesOrder || defaultOrder || []
        },
        values: config.facet_attributes?.reduce<Record<string, { sortRemainingBy: 'count' }>>(
          (sum, facet) => {
            const facetName = typeof facet === 'string' ? facet : facet.attribute

            // If request has explicit facet orders and the facet is not
            // in the query rule actions, we don't want to sort it
            if (
              queryRuleActions.facetAttributesOrder &&
              !queryRuleActions.facetAttributesOrder.includes(facetName)
            ) {
              return sum
            }

            return {
              ...sum,
              [facetName]: {
                sortRemainingBy: 'count'
              }
            }
          },
          {}
        )
      }
    }
  }
}
