import { CustomFacetConfig, FacetAttribute, FacetFieldConfig } from './types'

export const getFacet = (
  facet_attributes: FacetAttribute[],
  attributeName: string
): FacetAttribute | null => {
  const f = facet_attributes.find((a) => {
    if (typeof a === 'string') {
      return a === attributeName
    }
    return a.attribute === attributeName
  })
  return f || null
}

export const isNestedFacet = (facet: FacetAttribute): boolean => {
  return typeof facet !== 'string' && !!facet.nestedPath
}

export const getFacetField = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): string => {
  const attributeKey = typeof attribute === 'string' ? attribute : attribute.attribute

  if (facet_attributes.includes(attributeKey)) {
    return attributeKey
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a.attribute === attributeKey)?.field || attributeKey
  )
}

export const getFacetByAttribute = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): string => {
  const attributeKey = getFacetAttribute(attribute)

  if (facet_attributes.includes(attributeKey)) {
    return attributeKey
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a.attribute === attributeKey)?.attribute || attributeKey
  )
}

export const getFacetAttribute = (facetAttribute: FacetAttribute): string => {
  return typeof facetAttribute === 'string' ? facetAttribute : facetAttribute.attribute
}

export const getFacetFieldType = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): FacetFieldConfig['type'] => {
  const attributeKey = typeof attribute === 'string' ? attribute : attribute.attribute

  if (facet_attributes.includes(attributeKey)) {
    return 'string'
  }
  return (
    facet_attributes
      // @ts-ignore: object is possibly null
      .find((a) => a?.attribute === attributeKey)?.type || 'string'
  )
}

export const getFacetFieldConfig = (
  facet_attributes: FacetAttribute[],
  attribute: FacetAttribute
): FacetFieldConfig | CustomFacetConfig | undefined => {
  return facet_attributes.find((a) => {
    if (typeof a === 'string') {
      return false
    }
    return a.attribute === attribute
  }) as FacetFieldConfig | CustomFacetConfig | undefined
}

/**
 * Parses a `snippet_attributes` entry: `attribute` or `attribute:length` (default length 100).
 */
export const getSnippetFieldLength = (attribute: string) => {
  const defaultMatch = {
    attribute,
    length: 100
  }
  if (!attribute.includes(':')) {
    return defaultMatch
  }
  const match = attribute.match(/(.+)\:(\d+)/)
  if (!match) return defaultMatch
  return {
    attribute: match[1],
    length: parseInt(match[2])
  }
}
