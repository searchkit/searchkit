import { transformBaseFilters } from '../filters'
import { SearchSettingsConfig } from '../types'
import { DisjunctiveExampleRequest } from './mocks/AlgoliaRequests'

describe('filter functions', () => {
  const config: SearchSettingsConfig = {
    facet_attributes: [
      { attribute: 'author', field: 'author.keyword', type: 'string' },
      { attribute: 'price', field: 'price', type: 'numeric' }
    ],
    filter_attributes: [
      { attribute: 'publisher', field: 'publisher.keyword', type: 'string' },
      { attribute: 'genre', field: 'genre.keyword', type: 'string' },
      { attribute: 'date', field: 'date.field', type: 'date' },
      { attribute: 'nestedField', field: 'price', type: 'string', nestedPath: 'nested' }
    ],
    result_attributes: [],
    search_attributes: []
  }

  const getRequest = (filterString: string) => ({
    ...DisjunctiveExampleRequest[0],
    params: {
      ...(DisjunctiveExampleRequest[0] as any).params,
      filters: filterString
    }
  })

  it('should transform an instantsearch filter to an elasticsearch filter', () => {
    const isFilter = `(author:"Stephen King" OR genre:"Horror") AND publisher:"Penguin"`

    expect(transformBaseFilters(getRequest(isFilter), config)).toMatchInlineSnapshot(`
      [
        {
          "query_string": {
            "query": "(author.keyword:"Stephen King" OR genre.keyword:"Horror") AND publisher.keyword:"Penguin"",
          },
        },
      ]
    `)
  })

  it('filters without fields', () => {
    const isFilter = `(new york city) OR (big apple)`
    expect(transformBaseFilters(getRequest(isFilter), config)).toMatchInlineSnapshot(`
      [
        {
          "query_string": {
            "query": "(new york city) OR (big apple)",
          },
        },
      ]
    `)
  })

  it('filters without fields', () => {
    const isFilter = `date:[2012-01-01 TO 2012-12-31]`
    expect(transformBaseFilters(getRequest(isFilter), config)).toMatchInlineSnapshot(`
      [
        {
          "query_string": {
            "query": "date.field:[2012-01-01 TO 2012-12-31]",
          },
        },
      ]
    `)
  })

  it('should throw when field not detected', () => {
    const isFilter = `unknownField:"Stephen King"`
    expect(() =>
      transformBaseFilters(getRequest(isFilter), config)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Attribute "unknownField" is not defined as an attribute in the facet or filter search settings"`
    )
  })

  it('should throw when field is a nested field', () => {
    const isFilter = `nestedField:"Stephen King"`
    expect(() =>
      transformBaseFilters(getRequest(isFilter), config)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Attribute "nestedField" is a nested field and cannot be used as a filter. Nested fields are supported in facetFilers or numericFilters."`
    )
  })
})
