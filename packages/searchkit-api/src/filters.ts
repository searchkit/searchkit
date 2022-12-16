import type {
  AlgoliaMultipleQueriesQuery,
  FacetAttribute,
  SearchSettingsConfig,
  ElasticsearchQuery,
  FilterAttribute,
  FacetFieldConfig
} from './types'
import { getFacet, getFacetAttribute, isNestedFacet } from './utils'

export const transformNumericFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] => {
  const { params = {} } = request
  const { numericFilters } = params

  if (!Array.isArray(numericFilters)) {
    return []
  }

  return numericFilters.reduce((sum, filter) => {
    const [match, field, operator, value] = filter.match(
      /([\w\.\_\-]+)(\=|\!\=|\>|\>\=|\<|\<\=)(\d+)/
    )

    const facetFilterMap = getFacetFilterMap(
      config.facet_attributes || [],
      config.filter_attributes || []
    )
    const facetFilterConfig = facetFilterMap[field]

    if (!match) return sum

    const getFilter = (field: string, operator: string, value: string) => {
      if (operator === '=') {
        return {
          term: {
            [field]: value
          }
        }
      } else if (operator === '!=') {
        return {
          bool: {
            must_not: {
              term: {
                [field]: value
              }
            }
          }
        }
      } else if (operator === '>') {
        return {
          range: {
            [field]: {
              gt: value
            }
          }
        }
      } else if (operator === '>=') {
        return {
          range: {
            [field]: {
              gte: value
            }
          }
        }
      } else if (operator === '<') {
        return {
          range: {
            [field]: {
              lt: value
            }
          }
        }
      } else if (operator === '<=') {
        return {
          range: {
            [field]: {
              lte: value
            }
          }
        }
      }
    }

    const esFilter = []

    if (facetFilterConfig.nestedPath) {
      esFilter.push({
        nested: {
          path: facetFilterConfig.nestedPath,
          query: {
            bool: {
              filter: [
                getFilter(
                  facetFilterConfig.nestedPath + '.' + facetFilterConfig.field,
                  operator,
                  value
                )
              ]
            }
          }
        }
      })
    } else {
      esFilter.push(getFilter(facetFilterConfig.field, operator, value))
    }

    return [...sum, ...esFilter]
  }, [])
}

const termFilter = (field: string, value: string) => {
  return { term: { [field]: value } }
}

const getFacetFilterMap = (facets: FacetAttribute[], filters: FilterAttribute[]) => {
  return [...filters, ...facets].reduce<Record<string, FacetFieldConfig | FilterAttribute>>(
    (sum, filter) => {
      let f: FacetFieldConfig | FilterAttribute =
        typeof filter === 'string' ? { attribute: filter, field: filter, type: 'string' } : filter

      return {
        ...sum,
        [f.attribute]: f
      }
    },
    {}
  )
}

export const transformFacetFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
): ElasticsearchQuery[] => {
  const { params = {} } = request
  const { facetFilters } = params

  if (!Array.isArray(facetFilters)) {
    return []
  }

  const facetFilterMap = getFacetFilterMap(
    config.facet_attributes || [],
    config.filter_attributes || []
  )

  return facetFilters.reduce((sum, filter) => {
    if (Array.isArray(filter)) {
      return [
        ...sum,
        {
          bool: {
            should: filter.reduce((sum, filter) => {
              const [facet, value] = filter.split(':')
              const facetFilterConfig = facetFilterMap[facet]
              const field = facetFilterConfig.field

              if (isNestedFacet(facetFilterConfig)) {
                // detect if there is a nested filter in sum
                // if one doesn't exist, add one
                // if one does exist, add to it
                const nestedFilter = sum.find((filter: any) => {
                  return filter.nested && filter.nested.path === facetFilterConfig.nestedPath
                })

                if (nestedFilter) {
                  nestedFilter.nested.query.bool.should.push(
                    termFilter(`${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`, value)
                  )
                  return sum
                } else {
                  return [
                    ...sum,
                    {
                      nested: {
                        path: facetFilterConfig.nestedPath,
                        query: {
                          bool: {
                            should: [
                              termFilter(
                                `${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`,
                                value
                              )
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
              return [...sum, termFilter(field, value)]
            }, [])
          }
        }
      ]
    } else if (typeof filter === 'string') {
      const [facet, value] = filter.split(':')
      const facetAttribute = getFacetAttribute(facet)
      const facetConfig = getFacet(config.facet_attributes || [], facetAttribute)
      const field = typeof facetConfig === 'string' ? facetConfig : facetConfig.field

      if (typeof facetConfig !== 'string' && isNestedFacet(facetConfig) && facetConfig.nestedPath) {
        // detect if there is a nested filter in sum
        // if one doesn't exist, add one
        // if one does exist, add to it
        const nestedFilter = sum.find((filter: any) => {
          return filter.nested && filter.nested.path === facetConfig.nestedPath + '.'
        })

        if (nestedFilter) {
          nestedFilter.nested.query.bool.should.push(
            termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)
          )
          return sum
        } else {
          return [
            ...sum,
            {
              nested: {
                path: facetConfig.nestedPath,
                query: {
                  bool: {
                    should: [termFilter(`${facetConfig.nestedPath}.${facetConfig.field}`, value)]
                  }
                }
              }
            }
          ]
        }
      }
      return [...sum, termFilter(field, value)]
    }
  }, [])
}

export const transformBaseFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  const { params = {} } = request
  const { filters } = params

  if (!filters || filters === '') {
    return []
  }

  const filterMap = getFacetFilterMap(config.facet_attributes || [], config.filter_attributes || [])
  const regex = /([\w\.\-]+)\:/gi
  const queryString = filters.replace(regex, (match: string, word: string) => {
    if (!filterMap[word]) {
      throw new Error(
        `Attribute "${word}" is not defined as an attribute in the facet or filter search settings`
      )
    }

    if (!!filterMap[word].nestedPath) {
      throw new Error(
        `Attribute "${word}" is a nested field and cannot be used as a filter. Nested fields are supported in facetFilers or numericFilters.`
      )
    }

    return filterMap[word].field + ':'
  })

  return [
    {
      query_string: {
        query: queryString
      }
    }
  ]
}
