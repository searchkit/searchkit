import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'
import { buildSearchStatement } from '../sql/query'
import { transformResponse } from '../transformResponse'
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

  it('adds a pg_trgm match over the search attributes when fuzziness is set', () => {
    const statement = build(
      { indexName: 'products', params: { query: 'samsnug' } },
      { ...settings, fuzziness: 'AUTO:4,8' }
    )
    expect(statement.params).toEqual(['english', 'samsnug', 20, 0, ...HIGHLIGHT_PARAMS])
    expect(statement.text).toContain(`coalesce(t."name"::text, '') % $2`)
    expect(statement.text).toContain('similarity(')
    expect(statement.text).toMatchSnapshot()
  })

  it('has no pg_trgm match without fuzziness', () => {
    const statement = build({ indexName: 'products', params: { query: 'samsung' } })
    expect(statement.text).not.toContain(' % ')
    expect(statement.text).not.toContain('similarity(')
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

describe('query rules', () => {
  const rulesSettings: SearchSettingsConfig = {
    ...settings,
    highlight_attributes: [],
    filter_attributes: [
      { attribute: 'categories', field: 'categories', type: 'string', array: true }
    ],
    query_rules: [
      {
        id: 'cheap-tvs',
        conditions: [[{ context: 'query', value: 'cheap tvs', match_type: 'exact' }]],
        actions: [
          { action: 'QueryRewrite', query: '' },
          { action: 'QueryFilter', query: 'price:[0 TO 500] AND categories:TVs' },
          { action: 'QueryBoost', query: 'brand:LG', weight: 10 },
          { action: 'QueryBoost', query: 'brand:Sony OR price:<100', weight: 2.5 }
        ]
      },
      {
        id: 'pin',
        conditions: [[{ context: 'query', value: 'tv', match_type: 'exact' }]],
        actions: [{ action: 'PinnedResult', documentIds: ['b', 'a'] }]
      }
    ]
  }

  it('adds a CASE WHEN term per QueryBoost to the score', () => {
    const statement = build(
      { indexName: 'products', params: { query: 'cheap tvs' } },
      rulesSettings
    )
    expect(statement.params).toEqual(['LG', 10, 'Sony', 100, 2.5, 0, 500, ['TVs'], 20, 0])
    expect(statement.text).toContain(
      `(0::real + CASE WHEN t."brand" = $1 THEN $2::real ELSE 0 END + CASE WHEN (t."brand" = $3 OR (t."price" < $4)) THEN $5::real ELSE 0 END)::real AS _score`
    )
    // QueryRewrite '' -> no text predicate; QueryFilter -> WHERE
    expect(statement.text).not.toContain('@@')
    expect(statement.text).toContain('t."categories" @> $8')
    expect(statement.text).toMatchSnapshot()
  })

  it('puts PinnedResult ids first, in order, and matches them without the query', () => {
    const statement = build({ indexName: 'products', params: { query: 'tv' } }, rulesSettings)
    expect(statement.params).toEqual(['english', 'tv', ['b', 'a'], 20, 0])
    expect(statement.text).toContain(
      `(t."search_vector" @@ q.tsq OR t."id"::text = ANY($3::text[]))`
    )
    expect(statement.text).toContain(`array_position($3::text[], t."id"::text) AS _pin`)
    expect(statement.text).toContain('ORDER BY _pin ASC NULLS LAST, _score DESC, "id" ASC')
    expect(statement.text).toMatchSnapshot()
  })

  it('does not put pinned ids first when sorted by a field, as in Elasticsearch', () => {
    const statement = build(
      { indexName: 'products_price_asc', params: { query: 'tv' } },
      rulesSettings
    )
    expect(statement.text).toContain('OR t."id"::text = ANY($3::text[])')
    expect(statement.text).not.toContain('_pin')
    expect(statement.text).toContain('ORDER BY "price" ASC NULLS LAST, "id" ASC')
  })

  it('compiles the rule filters through the filter parser and validates their attributes', () => {
    expect(() =>
      build(
        { indexName: 'products', params: { query: 'cheap tvs' } },
        {
          ...rulesSettings,
          query_rules: [
            {
              id: 'bad',
              conditions: [[]],
              actions: [{ action: 'QueryBoost', query: 'unknown:x', weight: 1 }]
            }
          ]
        }
      )
    ).toThrow('Attribute "unknown" is not defined')
  })
})

it('returns the rule response parts: appliedRules, userData, renderingContent and the rewritten query', () => {
  const ruleSettings: SearchSettingsConfig = {
    ...settings,
    query_rules: [
      {
        id: 'banner',
        conditions: [[{ context: 'query', value: 'tvs', match_type: 'exact' }]],
        actions: [
          { action: 'QueryRewrite', query: 'television' },
          { action: 'RenderUserData', userData: JSON.stringify({ title: 'We have TVs!' }) },
          { action: 'RenderFacetsOrder', facetAttributesOrder: ['price', 'brand'] }
        ]
      }
    ]
  }
  const request = { indexName: 'products', params: { query: 'tvs', facets: ['*'] } }
  const rules = getQueryRulesActionsFromRequest(
    ruleSettings.query_rules || [],
    request,
    ruleSettings
  )
  const statement = buildSearchStatement(request, ruleSettings, rules, index)
  expect(statement.params.slice(0, 2)).toEqual(['english', 'television'])

  const response = transformResponse(
    { hits: [], total: 0, facets: [] },
    request,
    ruleSettings,
    rules,
    {
      idColumn: 'id',
      index: 'products'
    }
  )
  expect(response.appliedRules).toEqual(['banner'])
  expect(response.query).toBe('television')
  expect(response.userData).toEqual([{ title: 'We have TVs!' }])
  expect(response.renderingContent?.facetOrdering?.facets?.order).toEqual(['price', 'brand'])
})

describe('sorting', () => {
  const sortSettings: SearchSettingsConfig = {
    ...settings,
    highlight_attributes: [],
    sorting: {
      _price_desc: [
        { field: 'price', order: 'desc' },
        { field: '_score', order: 'desc' },
        { field: 'name', order: 'asc' }
      ],
      _nested: { field: 'price', order: 'asc', nestedPath: 'marketplace' },
      _mode: { field: 'price', order: 'asc', mode: 'min' }
    }
  }

  it('orders by every field of a multi-field sorting option, _score included', () => {
    const statement = build(
      { indexName: 'products_price_desc', params: { query: 'tv' } },
      sortSettings
    )
    expect(statement.text).toContain(
      'ORDER BY "price" DESC NULLS LAST, _score DESC, "name" ASC NULLS LAST, "id" ASC'
    )
    expect(statement.text).toMatchSnapshot()
  })

  it.each(['products_nested', 'products_mode'])(
    'throws for nestedPath / mode sorting options (%s)',
    (indexName) => {
      expect(() => build({ indexName, params: { query: '' } }, sortSettings)).toThrow(
        'nestedPath and mode are not supported by the postgres adapter'
      )
    }
  )
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
