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
    expect(built.params).toEqual(['english', 'tv', 2, 2])
    expect(built.text).toContain('websearch_to_tsquery($1::regconfig, $2)')
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
      exhaustiveNbHits: true,
      facets: {}
    })
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
        `\nSQL:\n${built.text}\nParams: ["english","tv",2,2]`
      )
    } finally {
      log.mockRestore()
    }
  })

  it('does not support search for facet values yet', () => {
    const adapter = PostgresAdapter({
      connection: { pool: { query: jest.fn() } },
      indices: { products: { table: 'products' } }
    })
    const facetRequest = {
      indexName: 'products',
      params: { facetName: 'brand', facetQuery: 'sam' }
    }
    expect(() => adapter.buildRequest(facetRequest, settings, rules(facetRequest))).toThrow(
      'search for facet values is not implemented yet'
    )
  })
})
