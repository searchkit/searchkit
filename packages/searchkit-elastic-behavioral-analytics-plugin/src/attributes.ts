import { SearchEventInputProperties } from '@elastic/behavioral-analytics-javascript-tracker'

import type { SearchResults, SearchParameters } from 'algoliasearch-helper'
import type { Hit } from 'instantsearch.js/es/types'
import { SearchClickFieldAttributes } from '.'

export function getPageAttribute(
  hit: Hit | undefined,
  searchClickFields: SearchClickFieldAttributes | undefined
) {
  if (!hit || !searchClickFields) return undefined

  return {
    title: hit?.[searchClickFields.titleField],
    url: hit?.[searchClickFields.urlField]
  }
}

export function getDocumentAttribute(id: string, index: string) {
  return {
    id,
    index
  }
}

const getKeyValue = (keys: string[], obj: Record<string, any>) => {
  for (const key of keys) {
    if (obj[key] && obj[key].length > 0) return obj[key].toString()
  }
  return ''
}

export function getSearchAttribute(
  lastResults: SearchResults,
  state: SearchParameters
): SearchEventInputProperties['search'] {
  const valueRefinements = Object.entries({
    ...state.disjunctiveFacetsRefinements,
    ...state.facetsRefinements,
    ...state.hierarchicalFacetsRefinements
  }).reduce((acc, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      return {
        ...acc,
        [key]: value
      }
    }
    return acc
  }, {})

  const filters = {
    ...valueRefinements,
    ...Object.keys(state.numericRefinements).reduce((acc, key) => {
      const v = state.numericRefinements[key]
      if (Object.keys(v).length === 0) return acc

      const start = getKeyValue(['>=', '>'], v)
      const end = getKeyValue(['<=', '<'], v)

      if (!start && !end) {
        return acc
      }

      return {
        ...acc,
        [key]: `${start || '*'}-${end || '*'}`
      }
    }, {})
  } as SearchEventInputProperties['search']['filters']

  const searchEvent = {
    query: state.query || '',
    filters: filters,
    page: {
      current: state.page || 1,
      size: state.hitsPerPage || 20
    },
    results: {
      total_results: lastResults?.nbHits || 0,
      items: []
    }
  }

  return searchEvent
}
