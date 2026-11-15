import { PostgresAdapter } from '../PostgresAdapter'
import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'

const settings: SearchSettingsConfig = {
  search_attributes: ['name'],
  result_attributes: ['name', 'description'],
  highlight_attributes: ['name'],
  snippet_attributes: ['description:200']
}

const request: MultipleQueriesQuery = {
  indexName: 'products',
  params: { query: 'tv', hitsPerPage: 2, page: 1 }
}

const rules = (req: MultipleQueriesQuery) => getQueryRulesActionsFromRequest([], req, settings)

describe('PostgresAdapter', () => {
  it('validates its configuration', () => {
    expect(() => PostgresAdapter({ indices: { products: { table: 'products' } } } as any)).toThrow(
      '`connection` is required'
    )
    expect(() => PostgresAdapter({ connection: 'postgres://localhost/db', indices: {} })).toThrow(
      '`indices` must map at least one indexName'
    )
    expect(() =>
      PostgresAdapter({
        connection: 'postgres://localhost/db',
        indices: { products: { table: 'products; DROP TABLE products' } }
      })
    ).toThrow('invalid table name')
    expect(() =>
      PostgresAdapter({
        connection: 'postgres://localhost/db',
        indices: { products: { table: 'products', id_column: 'id"' } }
      })
    ).toThrow('invalid column name')
  })

  it('does not connect when it is created', () => {
    const query = jest.fn()
    const adapter = PostgresAdapter({
      connection: { pool: { query } },
      indices: { products: { table: 'products' } }
    })
    expect(adapter.name).toBe('postgres')
    expect(query).not.toHaveBeenCalled()
  })

  it('builds a request object with the statement, its params, the request and the index', async () => {
    const adapter = PostgresAdapter({
      connection: { pool: { query: jest.fn() } },
      indices: { products: { table: 'products', search_vector_column: 'search_vector' } }
    })
    const built = await adapter.buildRequest(request, settings, rules(request))
    expect(built.indexName).toBe('products')
    expect(built.request).toBe(request)
    expect(built.params).toEqual([
      'english',
      'tv',
      2,
      2,
      'StartSel="<ais-highlight-0000000000>",StopSel="</ais-highlight-0000000000>",HighlightAll=true',
      'name',
      'StartSel="<ais-highlight-0000000000>",StopSel="</ais-highlight-0000000000>",MaxFragments=1,MaxWords=33,MinWords=16',
      'description'
    ])
    expect(built.text).toContain('websearch_to_tsquery($1::regconfig, $2)')
  })

  it('ANDs the getWhere predicate into the filters, renumbering its placeholders', async () => {
    const adapter = PostgresAdapter({
      connection: { pool: { query: jest.fn() } },
      indices: { products: { table: 'products', search_vector_column: 'search_vector' } }
    })
    const getWhere = jest.fn(() => ({
      text: 't.tenant_id = $1 AND t.visibility = ANY($2)',
      params: ['acme', ['public', 'internal']]
    }))
    const filtered = { indexName: 'products', params: { query: 'tv', numericFilters: ['price>1'] } }
    const filterSettings: SearchSettingsConfig = {
      ...settings,
      facet_attributes: [{ attribute: 'price', field: 'price', type: 'numeric' }]
    }
    const built = await adapter.buildRequest(
      filtered,
      filterSettings,
      getQueryRulesActionsFromRequest([], filtered, filterSettings),
      { getWhere }
    )
    expect(getWhere).toHaveBeenCalledWith('tv', { ...filterSettings, request: filtered })
    expect(built.text).toContain(
      'WHERE t."search_vector" @@ q.tsq\n    AND ((t."price" > $3))\n    AND (t.tenant_id = $4 AND t.visibility = ANY($5))'
    )
    expect(built.params.slice(0, 5)).toEqual(['english', 'tv', 1, 'acme', ['public', 'internal']])

    // also without a query or other filters
    const empty = { indexName: 'products', params: { query: '' } }
    const emptyBuilt = await adapter.buildRequest(empty, settings, rules(empty), {
      getWhere: () => ({ text: 'NOT t.deleted' })
    })
    expect(emptyBuilt.text).toContain('WHERE (NOT t.deleted)')

    await expect(async () =>
      adapter.buildRequest(empty, settings, rules(empty), {
        getWhere: () => ({ text: 't.a = $2', params: [1] })
      })
    ).rejects.toThrow('placeholder $2 in "t.a = $2" has no value (1 params)')
    await expect(async () =>
      adapter.buildRequest(empty, settings, rules(empty), { getWhere: () => ({} as any) })
    ).rejects.toThrow('`getWhere` must return `{ text, params }`')
  })

  it('rejects the Elasticsearch-only request options instead of ignoring them', async () => {
    const adapter = PostgresAdapter({
      connection: { pool: { query: jest.fn() } },
      indices: { products: { table: 'products' } }
    })
    await expect(async () =>
      adapter.buildRequest(request, settings, rules(request), { getBaseFilters: () => [] })
    ).rejects.toThrow('the `getBaseFilters` request option is Elasticsearch only. Use `getWhere`')
    await expect(async () =>
      adapter.buildRequest(request, settings, rules(request), { getQuery: () => false })
    ).rejects.toThrow('the `getQuery` request option is Elasticsearch only')
    await expect(async () =>
      adapter.buildRequest(request, settings, rules(request), { getKnnQuery: () => ({}) } as any)
    ).rejects.toThrow('the `getKnnQuery` request option was removed in v5')
  })

  it('throws for an indexName that is not configured', async () => {
    const adapter = PostgresAdapter({
      connection: { pool: { query: jest.fn() } },
      indices: { products: { table: 'products' } }
    })
    const other = { indexName: 'other', params: { query: '' } }
    expect(() => adapter.buildRequest(other, settings, rules(other))).toThrow(
      'no table configured for indexName "other"'
    )
  })

  it('runs the statements on the pool and transforms the rows into an InstantSearch response', async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [
        {
          hits: [
            { id: 'a', name: 'TV 1', description: 'A tv', _score: 0.5, _rn: 3 },
            { id: 'b', name: 'TV 2', description: null, _score: 0.25, _rn: 4 }
          ],
          total: '5'
        }
      ]
    })
    const adapter = PostgresAdapter({
      connection: { pool: { query } },
      indices: { products: { table: 'products' } }
    })
    const actions = rules(request)
    const built = await adapter.buildRequest(request, settings, actions)
    const [response] = await adapter.execute([built], { debug: false })

    expect(query).toHaveBeenCalledWith(built.text, built.params)
    const result = adapter.transformResponse(response, request, settings, actions)
    expect(result).toMatchObject({
      nbHits: 5,
      page: 1,
      nbPages: 3,
      hitsPerPage: 2,
      query: 'tv',
      index: 'products',
      exhaustiveNbHits: true
    })
    // no facets were requested
    expect(result.facets).toBeUndefined()
    expect(typeof result.processingTimeMS).toBe('number')
    expect(result.facets_stats).toBeUndefined()
    expect(result.hits).toEqual([
      {
        objectID: 'a',
        _index: 'products',
        _score: 0.5,
        name: 'TV 1',
        description: 'A tv',
        _highlightResult: { name: { matchLevel: 'none', matchedWords: [], value: 'TV 1' } },
        _snippetResult: { description: { matchLevel: 'none', matchedWords: [], value: 'A tv' } }
      },
      {
        objectID: 'b',
        _index: 'products',
        _score: 0.25,
        name: 'TV 2',
        description: null,
        _highlightResult: { name: { matchLevel: 'none', matchedWords: [], value: 'TV 2' } },
        _snippetResult: { description: { matchLevel: 'none', matchedWords: [], value: '' } }
      }
    ])
  })

  it('reports Postgres errors, with the SQL in debug mode', async () => {
    const query = jest.fn().mockRejectedValue(new Error('relation "products" does not exist'))
    const adapter = PostgresAdapter({
      connection: { pool: { query } },
      indices: { products: { table: 'products' } }
    })
    const built = await adapter.buildRequest(request, settings, rules(request))

    await expect(adapter.execute([built], { debug: false })).rejects.toThrow(
      'query for index "products" failed: relation "products" does not exist (enable debug mode'
    )

    const log = jest.spyOn(console, 'log').mockImplementation(() => {})
    try {
      await expect(adapter.execute([built], { debug: true })).rejects.toThrow(
        `\nSQL:\n${built.text}\nParams: ${JSON.stringify(built.params)}`
      )
    } finally {
      log.mockRestore()
    }
  })

  it('runs a search for facet values request and returns the facet hits', async () => {
    const query = jest.fn().mockResolvedValue({
      rows: [
        {
          facets: [
            { attribute: 'brand', entries: [{ value: 'Samsung', count: '12' }], stats: null }
          ]
        }
      ]
    })
    const facetSettings: SearchSettingsConfig = {
      ...settings,
      facet_attributes: [{ attribute: 'brand', field: 'brand', type: 'string' }]
    }
    const adapter = PostgresAdapter({
      connection: { pool: { query } },
      indices: { products: { table: 'products' } }
    })
    const facetRequest = {
      indexName: 'products',
      params: { query: '', facetName: 'brand', facetQuery: 'sam' }
    }
    const actions = getQueryRulesActionsFromRequest([], facetRequest, facetSettings)
    const built = await adapter.buildRequest(facetRequest, facetSettings, actions)
    expect(built.params).toEqual([10, 'sam%', '% sam%', 'brand'])
    const [response] = await adapter.execute([built], { debug: false })
    expect(adapter.transformFacetValuesResponse(response, facetRequest)).toMatchObject({
      facetHits: [
        {
          value: 'Samsung',
          highlighted: '<ais-highlight-0000000000>Sam</ais-highlight-0000000000>sung',
          count: 12
        }
      ],
      exhaustiveFacetsCount: true
    })
  })
})
