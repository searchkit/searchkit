import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, QueryRule, SearchSettingsConfig } from '@searchkit/core'
import { PostgresAdapter } from '../PostgresAdapter'
import { buildSearchStatement } from '../sql/query'
import type { StatementOptions } from '../sql/query'
import { getSemanticSearch, toVectorLiteral } from '../sql/semantic'

const embed = jest.fn(async (query: string) => [query.length, 0.5, 0])

const settings: SearchSettingsConfig = {
  search_attributes: ['name'],
  result_attributes: ['name'],
  facet_attributes: [
    { attribute: 'brand', field: 'brand', type: 'string' },
    { attribute: 'price', field: 'price', type: 'numeric' }
  ],
  semantic_search: { field: 'embedding', embed, k: 30 }
}

const withSemantic = (
  semantic: Partial<NonNullable<SearchSettingsConfig['semantic_search']>>,
  base: SearchSettingsConfig = settings
): SearchSettingsConfig => ({
  ...base,
  semantic_search: { ...(base.semantic_search as any), ...semantic }
})

const index = { table: 'products', search_vector_column: 'search_vector' }
const VECTOR = [0.1, 0.2, 0.3]

const build = (
  request: MultipleQueriesQuery,
  config: SearchSettingsConfig = settings,
  options: StatementOptions = { queryVector: VECTOR }
) =>
  buildSearchStatement(
    request,
    config,
    getQueryRulesActionsFromRequest(config.query_rules || [], request, config),
    index,
    options
  )

const query = (q: string, params: MultipleQueriesQuery['params'] = {}): MultipleQueriesQuery => ({
  indexName: 'products',
  params: { query: q, ...params }
})

describe('semantic_search', () => {
  beforeEach(() => embed.mockClear())

  it('fuses the text and vector rankings with RRF in hybrid mode (the default)', () => {
    const statement = build(query('tv', { facets: ['brand'] }))
    expect(statement.text).toContain('t."embedding" <=> $3::vector AS _distance')
    expect(statement.text).toContain('ORDER BY t."embedding" <=> $3::vector\n  LIMIT $4')
    expect(statement.text).toContain('sum(1.0 / (60 + _r)) AS _rank')
    expect(statement.text).toContain('FROM "products" t JOIN ranked r ON t."id" = r._id')
    expect(statement.text).toContain('coalesce(r._rank, 0)::float8 AS _score')
    // hits, total and facets come from the fused candidates
    expect(statement.text).toContain('total AS (SELECT count(*) AS n FROM base)')
    expect(statement.params).toEqual(['english', 'tv', '[0.1,0.2,0.3]', 30, 20, 0, 10, 'brand'])
    expect(statement.text).toMatchSnapshot()
  })

  it('ranks by distance only in semantic_only mode', () => {
    const statement = build(query('tv'), withSemantic({ mode: 'semantic_only' }))
    expect(statement.text).not.toContain('text_ranked')
    expect(statement.text).not.toContain('@@')
    expect(statement.text).toContain('ranked AS (SELECT _id, -_distance AS _rank FROM nearest)')
    expect(statement.params).toEqual(['english', 'tv', '[0.1,0.2,0.3]', 30, 20, 0])
    expect(statement.text).toMatchSnapshot()
  })

  it('ignores the vector in text_only mode', () => {
    const textOnly = build(query('tv'), withSemantic({ mode: 'text_only' }), {})
    const plain = build(query('tv'), { ...settings, semantic_search: undefined }, {})
    expect(textOnly).toEqual(plain)
    expect(textOnly.text).not.toContain('nearest')
    expect(textOnly.text).toMatchSnapshot()
  })

  it('has no vector search for an empty query, in any mode', () => {
    for (const mode of ['hybrid', 'semantic_only', 'text_only'] as const) {
      const statement = build(query(''), withSemantic({ mode }), {})
      expect(statement.text).not.toContain('nearest')
      expect(statement.params).toEqual([20, 0])
    }
  })

  it.each([
    ['cosine', '<=>'],
    ['l2', '<->'],
    ['inner_product', '<#>']
  ] as const)('uses the pgvector operator of the %s distance', (distance, operator) => {
    const statement = build(query('tv'), withSemantic({ distance }))
    expect(statement.text).toContain(`t."embedding" ${operator} $3::vector AS _distance`)
    expect(statement.text).toContain(`ORDER BY t."embedding" ${operator} $3::vector`)
    expect(statement.text).toMatchSnapshot()
  })

  it('applies the filters inside the vector search and the text search', () => {
    const statement = build(
      query('tv', { facetFilters: [['brand:Samsung']], numericFilters: ['price<=500'] }),
      withSemantic({ mode: 'hybrid' }),
      { queryVector: VECTOR, where: { text: 't.tenant = $1', params: ['acme'] } }
    )
    const filter = '((t."brand" = $3) AND (t."price" <= $4))'
    const nearest = statement.text.slice(
      statement.text.indexOf('nearest AS ('),
      statement.text.indexOf('text_ranked AS (')
    )
    const textRanked = statement.text.slice(
      statement.text.indexOf('text_ranked AS ('),
      statement.text.indexOf('\nranked AS (')
    )
    for (const cte of [nearest, textRanked]) {
      expect(cte).toContain(filter)
      expect(cte).toContain('(t.tenant = $5)')
    }
    expect(nearest).toContain('t."embedding" IS NOT NULL')
    // base takes the filtered candidates as they are
    const base = statement.text.slice(statement.text.indexOf('base AS ('))
    expect(base.slice(0, base.indexOf('hits AS ('))).not.toContain('WHERE')
    expect(statement.params).toEqual([
      'english',
      'tv',
      'Samsung',
      500,
      'acme',
      '[0.1,0.2,0.3]',
      30,
      20,
      0
    ])
    expect(statement.text).toMatchSnapshot()
  })

  it('keeps pinned results as candidates in both modes', () => {
    const rules: QueryRule[] = [
      {
        id: 'pin',
        conditions: [[{ context: 'query', value: 'tv', match_type: 'exact' }]],
        actions: [{ action: 'PinnedResult', documentIds: ['42'] }]
      }
    ]
    const hybrid = build(query('tv'), { ...settings, query_rules: rules })
    expect(hybrid.text).toContain('(t."search_vector" @@ q.tsq OR t."id"::text = ANY($3::text[]))')
    expect(hybrid.text).toContain('array_position($3::text[], t."id"::text) AS _pin')

    const semanticOnly = build(
      query('tv'),
      withSemantic({ mode: 'semantic_only' }, { ...settings, query_rules: rules })
    )
    expect(semanticOnly.text).toContain(
      'SELECT t."id" AS _id, NULL::float8 AS _rank FROM "products" t\n    WHERE t."id"::text = ANY($3::text[])'
    )
    expect(semanticOnly.text).toMatchSnapshot()
  })

  it('throws for model_id, which is Elasticsearch only', () => {
    expect(() =>
      build(query('tv'), withSemantic({ embed: undefined, model_id: 'my-model' }))
    ).toThrow('`model_id` (server-side inference) is Elasticsearch only')
    expect(() => build(query('tv'), withSemantic({ model_id: 'my-model' }))).toThrow(
      'is Elasticsearch only'
    )
    expect(() => build(query('tv'), withSemantic({ embed: undefined }))).toThrow(
      'the postgres adapter needs `embed`'
    )
  })

  it('validates the settings and the query vector', () => {
    expect(() => getSemanticSearch(withSemantic({ distance: 'dot' as any }))).toThrow(
      'unknown distance "dot"'
    )
    expect(() => getSemanticSearch(withSemantic({ mode: 'knn' as any }))).toThrow(
      'unknown mode "knn"'
    )
    expect(() => getSemanticSearch(withSemantic({ k: 0 }))).toThrow(
      '`k` must be a positive integer'
    )
    expect(() => getSemanticSearch(withSemantic({ field: 'embedding; --' }))).toThrow(
      'invalid column name'
    )
    expect(getSemanticSearch(withSemantic({ mode: 'text_only', model_id: 'x' }))).toBeUndefined()
    expect(getSemanticSearch(withSemantic({ k: undefined }))).toMatchObject({
      k: 50,
      distance: 'cosine',
      mode: 'hybrid'
    })
    expect(toVectorLiteral([1, -0.5, 2e-7])).toBe('[1,-0.5,2e-7]')
    expect(() => toVectorLiteral([])).toThrow('non-empty array of finite numbers')
    expect(() => toVectorLiteral([1, NaN])).toThrow('non-empty array of finite numbers')
    expect(() => toVectorLiteral('1,2' as any)).toThrow('non-empty array of finite numbers')
  })
})

describe('PostgresAdapter semantic search', () => {
  const adapter = PostgresAdapter({
    connection: { pool: { query: jest.fn() } },
    indices: { products: { table: 'products', search_vector_column: 'search_vector' } }
  })
  const rules = (req: MultipleQueriesQuery, config: SearchSettingsConfig = settings) =>
    getQueryRulesActionsFromRequest(config.query_rules || [], req, config)

  beforeEach(() => embed.mockClear())

  it('embeds the query (after query rules) and binds the vector', async () => {
    const request = query('  tv  ')
    const built = await adapter.buildRequest(request, settings, rules(request))
    expect(embed).toHaveBeenCalledWith('tv')
    expect(built.params).toContain('[2,0.5,0]')
    expect(built.text).toContain('nearest AS (')
  })

  it('does not embed an empty query, or in text_only mode', async () => {
    const empty = query('')
    await adapter.buildRequest(empty, settings, rules(empty))
    const textOnly = withSemantic({ mode: 'text_only' })
    const request = query('tv')
    const built = await adapter.buildRequest(request, textOnly, rules(request, textOnly))
    expect(embed).not.toHaveBeenCalled()
    expect(built.text).not.toContain('nearest')
  })

  it('rejects a bad vector from embed', async () => {
    const config = withSemantic({ embed: async () => [] })
    const request = query('tv')
    await expect(adapter.buildRequest(request, config, rules(request, config))).rejects.toThrow(
      '`embed` must return a non-empty array of finite numbers'
    )
  })
})
