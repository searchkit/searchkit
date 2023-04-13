import { MatchFilter, TermFilter } from './filterUtils'
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
      const nestedPathPresent = sum.find((filter: any) => {
        return filter.nested.path === facetFilterConfig.nestedPath
      })

      if (nestedPathPresent) {
        nestedPathPresent.nested.query.bool.filter.push(
          getFilter(facetFilterConfig.nestedPath + '.' + facetFilterConfig.field, operator, value)
        )
      } else {
        esFilter.push({
          nested: {
            path: facetFilterConfig.nestedPath,
            inner_hits: {},
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
      }
    } else {
      esFilter.push(getFilter(facetFilterConfig.field, operator, value))
    }

    return [...sum, ...esFilter]
  }, [])
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
              if (!facetFilterConfig)
                throw new Error(
                  `Facet "${facet}" not found in configuration. Add configuration to either facet_attributes or filter_attributes.`
                )
              const field = facetFilterConfig.field
              const filterClauseFn = facetFilterConfig.filterQuery || TermFilter

              if (isNestedFacet(facetFilterConfig)) {
                // detect if there is a nested filter in sum
                // if one doesn't exist, add one
                // if one does exist, add to it
                const nestedFilter = sum.find((filter: any) => {
                  return filter.nested && filter.nested.path === facetFilterConfig.nestedPath
                })

                if (nestedFilter) {
                  nestedFilter.nested.query.bool.should.push(
                    filterClauseFn(
                      `${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`,
                      value
                    )
                  )
                  return sum
                } else {
                  return [
                    ...sum,
                    {
                      nested: {
                        inner_hits: {},
                        path: facetFilterConfig.nestedPath,
                        query: {
                          bool: {
                            should: [
                              filterClauseFn(
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
              return [...sum, filterClauseFn(field, value)]
            }, [])
          }
        }
      ]
    } else if (typeof filter === 'string') {
      const [facet, value] = filter.split(':')

      const facetFilterConfig = facetFilterMap[facet]
      if (!facetFilterConfig)
        throw new Error(
          `Facet "${facet}" not found in configuration. Add configuration to either facet_attributes or filter_attributes.`
        )

      const filterClauseFn = facetFilterConfig.filterQuery || TermFilter

      if (isNestedFacet(facetFilterConfig) && facetFilterConfig.nestedPath) {
        // detect if there is a nested filter in sum
        // if one doesn't exist, add one
        // if one does exist, add to it
        const nestedFilter = sum.find((filter: any) => {
          return filter.nested && filter.nested.path === facetFilterConfig.nestedPath + '.'
        })

        if (nestedFilter) {
          nestedFilter.nested.query.bool.should.push(
            filterClauseFn(`${facetFilterConfig.nestedPath}.${facetFilterConfig.field}`, value)
          )
          return sum
        } else {
          return [
            ...sum,
            {
              nested: {
                inner_hits: {},
                path: facetFilterConfig.nestedPath,
                query: {
                  bool: {
                    should: [
                      filterClauseFn(
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
      return [...sum, filterClauseFn(facetFilterConfig.field, value)]
    }
  }, [])
}

export const transformQueryString = (
  facets: FacetAttribute[] = [],
  filters: FilterAttribute[] = [],
  queryString: string
) => {
  const regex = /([\w\.\-]+)\:/gi
  const filterMap = getFacetFilterMap(facets, filters)
  return queryString.replace(regex, (match: string, word: string) => {
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

  const queryString = transformQueryString(
    config.facet_attributes,
    config.filter_attributes,
    filters
  )

  return [
    {
      query_string: {
        query: queryString
      }
    }
  ]
}

export const transformGeoFilters = (
  request: AlgoliaMultipleQueriesQuery,
  config: SearchSettingsConfig
) => {
  if (!config.geo_attribute) {
    return []
  }
  const { params = {} } = request
  const { aroundLatLng, aroundRadius, insideBoundingBox } = params

  if (insideBoundingBox) {
    return [insideBoundingBoxFilter(insideBoundingBox, config.geo_attribute)]
  }

  if (aroundLatLng) {
    const geoPoint = aroundLatLng.split(',')

    return [
      {
        geo_distance: {
          distance: aroundRadius || '1000m',
          [config.geo_attribute]: {
            lat: geoPoint[0],
            lon: geoPoint[1]
          }
        }
      }
    ]
  }

  return []
}

function insideBoundingBoxFilter(
  insideBoundingBox: string | readonly (readonly number[])[],
  field: string
) {
  const geoBoundingboxFilter = (top: number, left: number, bottom: number, right: number) => {
    return {
      geo_bounding_box: {
        [field]: {
          top_right: {
            lat: top,
            lon: left
          },
          bottom_left: {
            lat: bottom,
            lon: right
          }
        }
      }
    }
  }

  if (typeof insideBoundingBox === 'string') {
    const [top, left, bottom, right] = insideBoundingBox.split(',')
    return geoBoundingboxFilter(
      parseFloat(top),
      parseFloat(left),
      parseFloat(bottom),
      parseFloat(right)
    )
  } else if (Array.isArray(insideBoundingBox)) {
    const geoBoundingboxes = insideBoundingBox.map((boundingBox) => {
      const [top, left, bottom, right] = boundingBox
      return geoBoundingboxFilter(
        parseFloat(top),
        parseFloat(left),
        parseFloat(bottom),
        parseFloat(right)
      )
    })

    return {
      bool: {
        should: geoBoundingboxes
      }
    }
  }
}
