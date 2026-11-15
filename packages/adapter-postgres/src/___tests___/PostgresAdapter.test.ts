import { PostgresAdapter } from '../PostgresAdapter'
import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'

const settings: SearchSettingsConfig = {
  search_attributes: ['name'],
  result_attributes: ['name']
}

const request: MultipleQueriesQuery = { indexName: 'products', params: { query: 'tv' } }

describe('PostgresAdapter', () => {
  it('validates its configuration', () => {
    expect(() => PostgresAdapter({ indices: { products: { table: 'products' } } } as any)).toThrow(
      '`connection` is required'
    )
    expect(() => PostgresAdapter({ connection: 'postgres://localhost/db', indices: {} })).toThrow(
      '`indices` must map at least one indexName'
    )
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

  it('does not run searches yet', () => {
    const adapter = PostgresAdapter({
      connection: 'postgres://localhost/db',
      indices: { products: { table: 'products' } }
    })
    const rules = getQueryRulesActionsFromRequest([], request, settings)
    expect(() => adapter.buildRequest(request, settings, rules)).toThrow(
      'buildRequest is not implemented yet'
    )
  })
})
