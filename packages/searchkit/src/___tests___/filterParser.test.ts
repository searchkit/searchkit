import { parseFilters, FilterParseError } from '../filterParser'
import type { SearchSettingsConfig } from '../types'

const settings: SearchSettingsConfig = {
  search_attributes: [],
  result_attributes: [],
  facet_attributes: [
    'type',
    { attribute: 'brand', field: 'brand.keyword', type: 'string' },
    { attribute: 'price', field: 'price', type: 'numeric' }
  ],
  filter_attributes: [
    { attribute: 'categories', field: 'categories.keyword', type: 'string' },
    { attribute: 'date', field: 'date', type: 'date' },
    { attribute: 'free_shipping', field: 'free_shipping', type: 'string' },
    { attribute: 'nested', field: 'code', type: 'string', nestedPath: 'marketplace' }
  ]
}

const parse = (input: string) => parseFilters(input, settings)

describe('parseFilters', () => {
  it('parses attr:value', () => {
    expect(parse('categories:TVs')).toEqual({
      op: 'eq',
      attribute: 'categories',
      value: 'TVs',
      raw: 'TVs'
    })
  })

  it('types numbers and booleans', () => {
    expect(parse('price:10')).toMatchObject({ op: 'eq', value: 10, raw: '10' })
    expect(parse('price:-1.5')).toMatchObject({ op: 'eq', value: -1.5 })
    expect(parse('free_shipping:true')).toMatchObject({ op: 'eq', value: true })
    expect(parse('free_shipping:false')).toMatchObject({ op: 'eq', value: false })
  })

  it('parses quoted values, with escaped quotes', () => {
    expect(parse('brand:"Stephen King"')).toEqual({
      op: 'eq',
      attribute: 'brand',
      value: 'Stephen King',
      raw: 'Stephen King'
    })
    expect(parse('brand:"say \\"hi\\" (now)"')).toMatchObject({ value: 'say "hi" (now)' })
    expect(parse('brand:"10"')).toMatchObject({ value: '10' })
  })

  it('parses ranges', () => {
    expect(parse('price:[0 TO 500]')).toEqual({
      op: 'range',
      attribute: 'price',
      gte: 0,
      lte: 500,
      raw: { gte: '0', lte: '500' }
    })
    expect(parse('price:{0 TO 500}')).toMatchObject({ gt: 0, lt: 500 })
    expect(parse('price:[10 TO *]')).toEqual({
      op: 'range',
      attribute: 'price',
      gte: 10,
      raw: { gte: '10' }
    })
    expect(parse('date:[2012-01-01 TO 2012-12-31]')).toMatchObject({
      gte: '2012-01-01',
      lte: '2012-12-31'
    })
  })

  it('parses comparisons', () => {
    expect(parse('price:>10')).toEqual({
      op: 'range',
      attribute: 'price',
      gt: 10,
      raw: { gt: '10' }
    })
    expect(parse('price:>=10')).toMatchObject({ gte: 10 })
    expect(parse('price:<10.5')).toMatchObject({ lt: 10.5 })
    expect(parse('price:<=-3')).toMatchObject({ lte: -3 })
  })

  it('parses AND / OR / NOT with AND binding tighter, and parentheses', () => {
    expect(parse('type:movie OR type:series AND brand:x')).toEqual({
      op: 'or',
      nodes: [
        { op: 'eq', attribute: 'type', value: 'movie', raw: 'movie' },
        {
          op: 'and',
          nodes: [
            { op: 'eq', attribute: 'type', value: 'series', raw: 'series' },
            { op: 'eq', attribute: 'brand', value: 'x', raw: 'x' }
          ]
        }
      ]
    })

    expect(parse('(brand:"Stephen King" OR type:Horror) AND NOT categories:Penguin')).toEqual({
      op: 'and',
      nodes: [
        {
          op: 'or',
          nodes: [
            { op: 'eq', attribute: 'brand', value: 'Stephen King', raw: 'Stephen King' },
            { op: 'eq', attribute: 'type', value: 'Horror', raw: 'Horror' }
          ]
        },
        {
          op: 'not',
          node: { op: 'eq', attribute: 'categories', value: 'Penguin', raw: 'Penguin' }
        }
      ]
    })
  })

  it('parses the e2e query rule filter', () => {
    expect(parse('price:[0 TO 500] AND categories:TVs')).toEqual({
      op: 'and',
      nodes: [
        { op: 'range', attribute: 'price', gte: 0, lte: 500, raw: { gte: '0', lte: '500' } },
        { op: 'eq', attribute: 'categories', value: 'TVs', raw: 'TVs' }
      ]
    })
  })

  it('keeps the attribute validation errors', () => {
    expect(() => parse('unknownField:"Stephen King"')).toThrow(
      'Attribute "unknownField" is not defined as an attribute in the facet or filter search settings'
    )
    expect(() => parse('nested:"x"')).toThrow(
      'Attribute "nested" is a nested field and cannot be used as a filter. Nested fields are supported in facetFilers or numericFilters.'
    )
  })

  it('does not validate attributes without settings', () => {
    expect(parseFilters('anything:1')).toMatchObject({ op: 'eq', attribute: 'anything' })
  })

  it.each([
    ['(new york city) OR (big apple)', '"new"'],
    ['type:movie type:series', '"type:series"'],
    ['type:mov*', '"mov*"'],
    ['type:movie~', '"movie~"'],
    ['type:movie and type:series', '"and"'],
    ['-type:movie', '"-type:movie"'],
    ['price:>abc', '"abc"'],
    ['price:[1 TO 2', '"end of input"'],
    ['(type:movie', '"end of input"'],
    ['type:movie)', '")"']
  ])('throws a clear error for unsupported syntax: %s', (input, token) => {
    expect(() => parse(input)).toThrow(FilterParseError)
    expect(() => parse(input)).toThrow(`Unsupported filter syntax ${token}`)
  })

  it('throws on an unterminated quote and on an empty filter', () => {
    expect(() => parse('brand:"abc')).toThrow('Unterminated quoted value')
    expect(() => parse('  ')).toThrow('Empty filter')
  })
})
