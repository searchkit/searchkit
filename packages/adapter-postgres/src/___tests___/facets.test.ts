import { getFilterAst, getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, QueryRule, SearchSettingsConfig } from '@searchkit/core'
import { buildSearchStatement } from '../sql/query'
import type { PostgresIndexConfig } from '../sql/query'
import { escapeLike, getFacetQueryPatterns, getRequestedFacets } from '../sql/facets'
import { compileFilter } from '../sql/filters'
import { Params } from '../sql/identifiers'
import { transformFacetValuesResponse, transformResponse } from '../transformResponse'
import type { PostgresSearchResponse } from '../transformResponse'

const settings: SearchSettingsConfig = {
  search_attributes: ['name'],
  result_attributes: ['name'],
  facet_attributes: [
    { attribute: 'brand', field: 'brand', type: 'string' },
    { attribute: 'categories.lvl0', field: 'hierarchical_categories_lvl0', type: 'string' },
    { attribute: 'categories.lvl1', field: 'hierarchical_categories_lvl1', type: 'string' },
    { attribute: 'tags', field: 'tags', type: 'string', array: true },
    { attribute: 'price', field: 'price', type: 'numeric' },
    { attribute: 'released', field: 'released', type: 'date' }
  ],
  filter_attributes: [
    { attribute: 'categories', field: 'categories', type: 'string', array: true },
    { attribute: 'sizes', field: 'sizes', type: 'numeric', array: true },
    { attribute: 'free_shipping', field: 'free_shipping', type: 'string' }
  ]
}

const index: PostgresIndexConfig = { table: 'products', search_vector_column: 'search_vector' }

const rulesFor = (request: MultipleQueriesQuery, config: SearchSettingsConfig = settings) =>
  getQueryRulesActionsFromRequest(config.query_rules || [], request, config)

const build = (request: MultipleQueriesQuery, config: SearchSettingsConfig = settings) =>
  buildSearchStatement(request, config, rulesFor(request, config), index)

const facetsOf = (request: MultipleQueriesQuery, config: SearchSettingsConfig = settings) =>
  getRequestedFacets(request, config, rulesFor(request, config)).map((f) => f.attribute)

describe('facets', () => {
  it('builds a GROUP BY CTE for a string facet', () => {
    const statement = build({
      indexName: 'products',
      params: { query: '', facets: ['brand'], maxValuesPerFacet: 5 }
    })
    expect(statement.params).toEqual([20, 0, 5, 'brand'])
    expect(statement.text).toContain('ORDER BY count(*) DESC, _f.value::text COLLATE "C" ASC')
    expect(statement.text).toMatchSnapshot()
  })

  it('adds min / max / avg / sum for a numeric facet', () => {
    const statement = build({ indexName: 'products', params: { query: 'tv', facets: ['price'] } })
    // maxValuesPerFacet defaults to 10, as in the Elasticsearch adapter
    expect(statement.params).toEqual(['english', 'tv', 20, 0, 10, 'price'])
    expect(statement.text).toContain('facet_0_stats AS (')
    expect(statement.text).toContain('ORDER BY count(*) DESC, _f.value ASC')
    expect(statement.text).toMatchSnapshot()
  })

  it('unnests an array: true facet, counting each row once per distinct value', () => {
    const statement = build({ indexName: 'products', params: { query: '', facets: ['tags'] } })
    expect(statement.text).toContain(
      'base CROSS JOIN LATERAL (SELECT DISTINCT _u.value FROM unnest(base."tags") AS _u(value) WHERE _u.value IS NOT NULL) _f'
    )
    expect(statement.text).toMatchSnapshot()
  })

  it('computes the hierarchical levels as plain columns', () => {
    const statement = build({
      indexName: 'products',
      params: {
        query: '',
        facets: ['categories.lvl0', 'categories.lvl1'],
        facetFilters: [['categories.lvl0:TV & Home Theater']]
      }
    })
    expect(statement.params).toEqual([
      'TV & Home Theater',
      20,
      0,
      10,
      'categories.lvl0',
      'categories.lvl1'
    ])
    expect(statement.text).toContain('t."hierarchical_categories_lvl0" = $1')
    expect(statement.text).toContain('FROM (SELECT base."hierarchical_categories_lvl1" AS value')
  })

  it('has no facets column when no facets are requested', () => {
    expect(build({ indexName: 'products', params: { query: '' } }).text).not.toContain('facets')
    expect(build({ indexName: 'products', params: { query: '', facets: [] } }).text).not.toContain(
      'facets'
    )
  })

  describe('requested facets', () => {
    it("'*' is every string and numeric facet attribute (date facets are not aggregated, like Elasticsearch)", () => {
      expect(facetsOf({ indexName: 'products', params: { facets: ['*'] } })).toEqual([
        'brand',
        'categories.lvl0',
        'categories.lvl1',
        'tags',
        'price'
      ])
    })

    it('an explicit list, in its order, ignoring unknown attributes', () => {
      expect(
        facetsOf({ indexName: 'products', params: { facets: ['price', 'unknown', 'brand'] } })
      ).toEqual(['price', 'brand'])
      expect(facetsOf({ indexName: 'products', params: { facets: 'brand' } })).toEqual(['brand'])
    })

    it("'*' follows a RenderFacetsOrder rule", () => {
      const query_rules: QueryRule[] = [
        {
          id: 'order',
          conditions: [[]],
          actions: [{ action: 'RenderFacetsOrder', facetAttributesOrder: ['price', 'brand'] }]
        }
      ]
      const config = { ...settings, query_rules }
      expect(facetsOf({ indexName: 'products', params: { facets: ['*'] } }, config)).toEqual([
        'price',
        'brand'
      ])
      // an explicit list is not changed by the rule
      expect(facetsOf({ indexName: 'products', params: { facets: ['tags'] } }, config)).toEqual([
        'tags'
      ])
    })

    it('rejects Elasticsearch-only facets', () => {
      expect(() =>
        facetsOf(
          { indexName: 'products', params: { facets: ['*'] } },
          {
            ...settings,
            facet_attributes: [
              { attribute: 'n', field: 'n', type: 'string', nestedPath: 'marketplace' }
            ]
          }
        )
      ).toThrow('nested fields are not supported by the postgres adapter')
      expect(() =>
        facetsOf(
          { indexName: 'products', params: { facets: ['*'] } },
          {
            ...settings,
            facet_attributes: [
              {
                attribute: 'c',
                field: 'c',
                type: 'string',
                facetQuery: () => ({}),
                filterQuery: () => ({}),
                facetResponse: () => ({})
              }
            ]
          }
        )
      ).toThrow('custom facets are Elasticsearch only')
    })
  })

  it('a disjunctive facet request keeps only the filters InstantSearch sends with it', () => {
    // InstantSearch (algoliasearch-helper) sends one extra request per refined disjunctive facet,
    // with that facet's own refinements removed from facetFilters; the statement filters by
    // exactly the facetFilters of the request, so the facet counts ignore its own refinement.
    const statement = build({
      indexName: 'products',
      params: {
        query: '',
        hitsPerPage: 0,
        facets: ['brand'],
        facetFilters: [['categories.lvl0:Cameras']]
      }
    })
    expect(statement.params).toEqual(['Cameras', 0, 0, 10, 'brand'])
    expect(statement.text).not.toContain('t."brand" =')
  })
})

describe('search for facet values', () => {
  it('filters the grouped values with a case-insensitive ILIKE, and skips hits', () => {
    const statement = build({
      indexName: 'products',
      params: {
        query: 'tv',
        facetName: 'brand',
        facetQuery: 'Sam',
        maxValuesPerFacet: 7,
        facetFilters: ['categories:TVs']
      }
    })
    expect(statement.params).toEqual(['english', 'tv', ['TVs'], 7, 'Sam%', '% Sam%', 'brand'])
    expect(statement.text).toContain('WHERE _f.value::text ILIKE $5 OR _f.value::text ILIKE $6')
    expect(statement.text).not.toContain('hits AS')
    expect(statement.text).not.toContain('_stats AS')
    expect(statement.text).toMatchSnapshot()
  })

  it('matches a prefix of the value, or of a later word for queries longer than two characters', () => {
    expect(getFacetQueryPatterns('sa')).toEqual(['sa%'])
    expect(getFacetQueryPatterns('sam')).toEqual(['sam%', '% sam%'])
  })

  it('escapes LIKE wildcards in the facet query', () => {
    expect(escapeLike('10%_off\\')).toBe('10\\%\\_off\\\\')
    expect(getFacetQueryPatterns('-40 b%')).toEqual(['-40 b\\%%', '% -40 b\\%%'])
  })

  it('throws for a facet that is not configured', () => {
    expect(() =>
      build({ indexName: 'products', params: { query: '', facetName: 'nope', facetQuery: 'x' } })
    ).toThrow('Facet "nope" is not a string or numeric facet')
  })
})

describe('filters', () => {
  const compile = (filters: string, config: SearchSettingsConfig = settings) => {
    const params = new Params()
    const request = { indexName: 'products', params: { filters } }
    const text = compileFilter(getFilterAst(request, config)!, config, params, 't.')
    return { text, params: params.values }
  }

  const compileRequest = (params: MultipleQueriesQuery['params']) => {
    const statement = build({ indexName: 'products', params: { query: '', ...params } })
    const where = statement.text.match(/WHERE ([\s\S]*?)\n\)/)
    return { where: where && where[1], params: statement.params }
  }

  it('facetFilters: conjunctive and disjunctive values', () => {
    expect(compileRequest({ facetFilters: [['brand:Samsung', 'brand:LG'], 'brand:Sony'] })).toEqual(
      {
        where: '((t."brand" = $1 OR t."brand" = $2) AND t."brand" = $3)',
        params: ['Samsung', 'LG', 'Sony', 20, 0]
      }
    )
  })

  it('facetFilters: an escaped leading "-" is part of the value, as in the Elasticsearch adapter', () => {
    // InstantSearch escapes a value starting with "-" as "\-"; an unescaped "-" is not an
    // exclusion in Searchkit (the Elasticsearch adapter sends a term query for "-7" too)
    expect(compileRequest({ facetFilters: ['brand:\\-40 Below', 'brand:-7'] })).toEqual({
      where: '(t."brand" = $1 AND t."brand" = $2)',
      params: ['-40 Below', '-7', 20, 0]
    })
  })

  it('facetFilters on an array: true attribute use @> (contains)', () => {
    expect(compileRequest({ facetFilters: [['categories:TVs', 'categories:Cameras']] })).toEqual({
      where: '((t."categories" @> $1 OR t."categories" @> $2))',
      params: [['TVs'], ['Cameras'], 20, 0]
    })
  })

  it('numericFilters: comparisons, ranges and != (a negation)', () => {
    expect(
      compileRequest({ numericFilters: ['price>=10', 'price:20 TO 30', 'price!=15'] })
    ).toEqual({
      where:
        '((t."price" >= $1) AND (t."price" >= $2 AND t."price" <= $3) AND NOT coalesce(t."price" = $4, false))',
      params: [10, 20, 30, 15, 20, 0]
    })
  })

  it('numericFilters on an array: true attribute match when any value is in range', () => {
    expect(compileRequest({ numericFilters: ['sizes>=10', 'sizes=12'] })).toEqual({
      where:
        '(EXISTS (SELECT 1 FROM unnest(t."sizes") AS _v(value) WHERE _v.value >= $1) AND t."sizes" @> $2)',
      params: [10, [12], 20, 0]
    })
  })

  it('the filters string: AND / OR / NOT, quoted values, ranges and booleans', () => {
    expect(
      compile(
        'brand:"Black & Decker" OR (price:[10 TO *] AND NOT categories:TVs) OR free_shipping:true'
      )
    ).toEqual({
      text: '((t."brand" = $1 OR ((t."price" >= $2) AND NOT coalesce(t."categories" @> $3, false)) OR t."free_shipping" = $4))',
      params: ['Black & Decker', 10, ['TVs'], true]
    })
  })

  it('the filters string: a NOT on an array: true attribute matches rows without the value', () => {
    expect(compile('NOT categories:TVs')).toEqual({
      text: '(NOT coalesce(t."categories" @> $1, false))',
      params: [['TVs']]
    })
  })

  it('in and exists nodes, scalar and array', () => {
    const params = new Params()
    expect(
      compileFilter(
        {
          op: 'and',
          nodes: [
            { op: 'in', attribute: 'brand', values: ['a', 'b'] },
            { op: 'in', attribute: 'categories', values: ['c', 'd'] },
            { op: 'exists', attribute: 'brand' },
            { op: 'exists', attribute: 'categories' },
            { op: 'range', attribute: 'sizes', gt: 1, lt: 5 }
          ]
        },
        settings,
        params,
        't.'
      )
    ).toBe(
      '(t."brand" = ANY($1) AND t."categories" && $2 AND t."brand" IS NOT NULL AND cardinality(t."categories") > 0 AND EXISTS (SELECT 1 FROM unnest(t."sizes") AS _v(value) WHERE _v.value > $3 AND _v.value < $4))'
    )
    expect(params.values).toEqual([['a', 'b'], ['c', 'd'], 1, 5])
  })

  it('QueryFilter rule strings compile into the WHERE, AND-ed with the request filters', () => {
    const query_rules: QueryRule[] = [
      {
        id: 'cheap-tvs',
        conditions: [[{ context: 'query', value: 'cheap tvs', match_type: 'exact' }]],
        actions: [
          { action: 'QueryRewrite', query: '' },
          { action: 'QueryFilter', query: 'price:[0 TO 500] AND categories:TVs' }
        ]
      }
    ]
    const config = { ...settings, query_rules }
    const request = {
      indexName: 'products',
      params: { query: 'cheap tvs', facetFilters: ['brand:LG'] }
    }
    const statement = buildSearchStatement(request, config, rulesFor(request, config), index)
    expect(statement.text).toContain(
      'WHERE ((t."brand" = $1) AND ((t."price" >= $2 AND t."price" <= $3) AND t."categories" @> $4))'
    )
    expect(statement.params).toEqual(['LG', 0, 500, ['TVs'], 20, 0])
  })

  it('never puts a facet query or facet value in the SQL text', () => {
    const value = `x'); DROP TABLE products; --`
    const statement = build({
      indexName: 'products',
      params: { query: '', facetName: 'brand', facetQuery: value, facetFilters: [`tags:${value}`] }
    })
    expect(statement.text).not.toContain('DROP')
    expect(statement.params).toEqual(expect.arrayContaining([[value], `${value}%`]))
  })
})

describe('transformResponse facets', () => {
  const request = { indexName: 'products', params: { query: '', facets: ['*'] } }
  const response: PostgresSearchResponse = {
    hits: [],
    total: '3',
    facets: [
      {
        attribute: 'brand',
        entries: [
          { value: 'Samsung', count: 2 },
          { value: 'LG', count: 1 }
        ],
        stats: null
      },
      {
        attribute: 'price',
        entries: [
          { value: 199.99, count: '2' },
          { value: 5, count: 1 }
        ],
        stats: { min: 5, max: 199.99, avg: 134.99333333333334, sum: 404.98 }
      },
      { attribute: 'tags', entries: [], stats: null }
    ]
  }

  it('returns facets and facets_stats in the shape of the Elasticsearch adapter', () => {
    const result = transformResponse(response, request, settings, rulesFor(request), {
      idColumn: 'id',
      index: 'products'
    })
    expect(result.facets).toEqual({
      brand: { Samsung: 2, LG: 1 },
      price: { '199.99': 2, '5': 1 },
      tags: {}
    })
    // value order is count order
    expect(Object.keys(result.facets!.brand)).toEqual(['Samsung', 'LG'])
    expect(result.facets_stats).toEqual({
      price: { min: 5, avg: 134.99333333333334, max: 199.99, sum: 404.98 }
    })
    expect(Object.keys(result.facets_stats!.price)).toEqual(['min', 'avg', 'max', 'sum'])
    expect(result.nbHits).toBe(3)
  })

  it('has empty stats for a numeric facet without values', () => {
    const result = transformResponse(
      {
        hits: [],
        total: 0,
        facets: [
          {
            attribute: 'price',
            entries: [],
            stats: { min: null, max: null, avg: null, sum: 0 }
          }
        ]
      },
      request,
      settings,
      rulesFor(request),
      { idColumn: 'id', index: 'products' }
    )
    expect(result.facets).toEqual({ price: {} })
    expect(result.facets_stats).toEqual({ price: { min: null, avg: null, max: null, sum: 0 } })
  })

  it('has no facets when none were requested, like the Elasticsearch adapter', () => {
    const result = transformResponse({ hits: [], total: 0 }, request, settings, rulesFor(request), {
      idColumn: 'id',
      index: 'products'
    })
    expect(result).not.toHaveProperty('facets')
    expect(result).not.toHaveProperty('facets_stats')
  })

  it('returns facet hits with highlighted values for a search for facet values', () => {
    const facetRequest = {
      indexName: 'products',
      params: {
        facetName: 'brand',
        facetQuery: 'sam',
        highlightPreTag: '<b>',
        highlightPostTag: '</b>'
      }
    }
    expect(
      transformFacetValuesResponse(
        {
          facets: [
            {
              attribute: 'brand',
              entries: [
                { value: 'Samsung', count: '4' },
                { value: 'Big Sam (sam.)', count: 1 }
              ],
              stats: null
            }
          ],
          took: 3
        },
        facetRequest
      )
    ).toEqual({
      facetHits: [
        { value: 'Samsung', highlighted: '<b>Sam</b>sung', count: 4 },
        { value: 'Big Sam (sam.)', highlighted: 'Big <b>Sam</b> (<b>sam</b>.)', count: 1 }
      ],
      exhaustiveFacetsCount: true,
      processingTimeMS: 3
    })
  })

  it('uses the InstantSearch highlight tags by default', () => {
    expect(
      transformFacetValuesResponse(
        { facets: [{ attribute: 'brand', entries: [{ value: 'LG', count: 1 }], stats: null }] },
        { indexName: 'products', params: { facetName: 'brand', facetQuery: 'l' } }
      ).facetHits
    ).toEqual([
      {
        value: 'LG',
        highlighted: '<ais-highlight-0000000000>L</ais-highlight-0000000000>G',
        count: 1
      }
    ])
  })
})
