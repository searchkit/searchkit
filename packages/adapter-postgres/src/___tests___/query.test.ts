import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'
import { buildSearchStatement } from '../sql/query'
import type { PostgresIndexConfig } from '../sql/query'
import { quoteColumn, quoteTable } from '../sql/identifiers'

const settings: SearchSettingsConfig = {
  search_attributes: [{ field: 'name', weight: 3 }, { field: 'brand', weight: 2 }, 'description'],
  result_attributes: ['name', 'description'],
  highlight_attributes: ['name'],
  facet_attributes: [
    { attribute: 'brand', field: 'brand', type: 'string' },
    { attribute: 'price', field: 'price', type: 'numeric' }
  ],
  sorting: {
    default: { field: '_score', order: 'desc' },
    _price_asc: { field: 'price', order: 'asc' },
    _price_desc: [
      { field: 'price', order: 'desc' },
      { field: 'name', order: 'asc' }
    ]
  }
}

const index: PostgresIndexConfig = {
  table: 'products',
  id_column: 'id',
  search_vector_column: 'search_vector',
  text_search_config: 'english'
}

// the `_highlight` params of `highlight_attributes: ['name']`: the ts_headline options and the attribute
const HIGHLIGHT_PARAMS = [
  'StartSel="<ais-highlight-0000000000>",StopSel="</ais-highlight-0000000000>",HighlightAll=true',
  'name'
]

const build = (
  request: MultipleQueriesQuery,
  config: SearchSettingsConfig = settings,
  indexConfig: PostgresIndexConfig = index
) =>
  buildSearchStatement(
    request,
    config,
    getQueryRulesActionsFromRequest(config.query_rules || [], request, config),
    indexConfig
  )

describe('buildSearchStatement', () => {
  it('searches the search vector column for a query', () => {
    const statement = build({ indexName: 'products', params: { query: 'samsung tv' } })
    expect(statement.params).toEqual(['english', 'samsung tv', 20, 0, ...HIGHLIGHT_PARAMS])
    expect(statement.text).toMatchSnapshot()
  })

  it('has no text predicate, a zero score and a deterministic order for an empty query', () => {
    const statement = build({ indexName: 'products', params: { query: '' } })
    expect(statement.params).toEqual([20, 0])
    expect(statement.text).not.toContain('@@')
    expect(statement.text).toContain('0::real AS _score')
    expect(statement.text).toMatchSnapshot()
  })

  it('pages with LIMIT / OFFSET', () => {
    const statement = build({
      indexName: 'products',
      params: { query: '', page: 3, hitsPerPage: 15 }
    })
    expect(statement.params).toEqual([15, 45])
    expect(statement.text).toContain('LIMIT $1 OFFSET $2')
    expect(statement.text).toMatchSnapshot()
  })

  it('orders by the sorting option of the indexName suffix', () => {
    const asc = build({ indexName: 'products_price_asc', params: { query: 'tv' } })
    expect(asc.text).toContain('ORDER BY "price" ASC NULLS LAST, "id" ASC')
    expect(asc.text).toMatchSnapshot()

    const desc = build({ indexName: 'products_price_desc', params: { query: '' } })
    expect(desc.text).toContain('ORDER BY "price" DESC NULLS LAST, "name" ASC NULLS LAST, "id" ASC')
    expect(desc.text).toMatchSnapshot()
  })

  it('allows _score as a sort field', () => {
    const statement = build({ indexName: 'products', params: { query: 'tv' } })
    expect(statement.text).toContain('ORDER BY _score DESC, "id" ASC')
  })

  it('builds the tsvector from search_attributes, weighted by descending weight, without a search vector column', () => {
    const statement = build({ indexName: 'products', params: { query: 'tv' } }, settings, {
      table: 'shop.products'
    })
    expect(statement.text).toContain(
      `setweight(to_tsvector($1::regconfig, coalesce(t."name"::text, '')), 'A') || setweight(to_tsvector($1::regconfig, coalesce(t."brand"::text, '')), 'B') || setweight(to_tsvector($1::regconfig, coalesce(t."description"::text, '')), 'C')`
    )
    expect(statement.text).toContain('FROM "shop"."products" t CROSS JOIN q')
    expect(statement.params).toEqual(['english', 'tv', 20, 0, ...HIGHLIGHT_PARAMS])
    expect(statement.text).toMatchSnapshot()
  })

  it('compiles filters into a parameterised WHERE', () => {
    const statement = build({
      indexName: 'products',
      params: {
        query: 'tv',
        facetFilters: [['brand:Samsung', 'brand:LG'], 'brand:Sony'],
        numericFilters: ['price>=100', 'price<=500']
      }
    })
    expect(statement.params).toEqual([
      'english',
      'tv',
      'Samsung',
      'LG',
      'Sony',
      100,
      500,
      20,
      0,
      ...HIGHLIGHT_PARAMS
    ])
    expect(statement.text).toMatchSnapshot()
  })

  it('throws for geo filters', () => {
    expect(() =>
      build(
        { indexName: 'products', params: { query: '', aroundLatLng: '1,2', aroundRadius: 10 } },
        { ...settings, geo_attribute: 'location' }
      )
    ).toThrow('not supported by the postgres adapter')
  })

  it('never puts a value in the SQL text, only in params', () => {
    const value = `x'); DROP TABLE products; --`
    const statement = build(
      {
        indexName: 'products_price_asc',
        params: {
          query: value,
          page: 2,
          hitsPerPage: 7,
          facetFilters: [`brand:${value}`],
          numericFilters: ['price>=123.45'],
          filters: `brand:"${value}" OR price:[42 TO 99]`
        }
      },
      settings,
      { table: 'products' }
    )
    // ('7' is not checked: it is also in the placeholder $7)
    for (const v of [value, 'DROP', '123.45', '42', '99', '14']) {
      expect(statement.text).not.toContain(v)
    }
    expect(statement.params).toEqual(
      expect.arrayContaining([value, 123.45, 42, 99, 7, 14, 'english'])
    )
    expect(statement.text).not.toContain('english')
  })
})

describe('identifiers', () => {
  it('quotes valid identifiers', () => {
    expect(quoteColumn('price')).toBe('"price"')
    expect(quoteColumn('_Col_1')).toBe('"_Col_1"')
    expect(quoteTable('products')).toBe('"products"')
    expect(quoteTable('shop.products')).toBe('"shop"."products"')
  })

  it.each(['', '1abc', 'name"', 'a b', 'a-b', 'a.b', 'price; DROP TABLE x', 'brand.keyword', 'é'])(
    'rejects the column name %p',
    (name) => {
      expect(() => quoteColumn(name)).toThrow('invalid column name')
    }
  )

  it.each(['a.b.c', '.products', 'shop.', 'shop."products"', 'products--'])(
    'rejects the table name %p',
    (name) => {
      expect(() => quoteTable(name)).toThrow('invalid table name')
    }
  )

  it('rejects bad names from the search settings', () => {
    expect(() =>
      build(
        { indexName: 'products', params: { query: '' } },
        {
          ...settings,
          result_attributes: ['name', 'brand.keyword']
        }
      )
    ).toThrow('invalid column name "brand.keyword"')

    expect(() =>
      build(
        { indexName: 'products_price_asc', params: { query: '' } },
        {
          ...settings,
          sorting: { _price_asc: { field: 'price DESC', order: 'asc' } }
        }
      )
    ).toThrow('invalid column name "price DESC"')

    expect(() =>
      build(
        { indexName: 'products', params: { query: 'tv' } },
        {
          ...settings,
          search_attributes: ['name::text']
        },
        { table: 'products' }
      )
    ).toThrow('invalid column name "name::text"')
  })
})
