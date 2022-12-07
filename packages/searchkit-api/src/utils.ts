import { FacetAttribute, FacetFieldConfig } from './types'

export const createRegexQuery = (queryString: string) => {
  let query = queryString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  query = query
    .split('')
    .map((char) => {
      if (/[a-z]/.test(char)) {
        return `[${char}${char.toUpperCase()}]`
      }
      return char
    })
    .join('')
  query = `${query}.*`
  if (queryString.length > 2) {
    query = `([a-zA-Z]+ )+?${query}`
  }
  return query
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
