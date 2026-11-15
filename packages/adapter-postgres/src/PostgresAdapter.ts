import pg from 'pg'
import type { SearchAdapter } from '@searchkit/core'

/**
 * @description How an InstantSearch `indexName` maps to a table.
 */
export interface PostgresIndexConfig {
  /** The table to search. May be schema-qualified: 'shop.products' */
  table: string
  /** The primary key column, returned as `objectID`. Defaults to 'id' */
  id_column?: string
  /** A precomputed `tsvector` column (recommended, with a GIN index). Without it the text is vectorised at query time from `search_attributes` */
  search_vector_column?: string
  /** The text search configuration (regconfig) used by `websearch_to_tsquery` / `to_tsvector`. Defaults to 'english' */
  text_search_config?: string
}

/**
 * @description The subset of a `pg` `Pool` the adapter uses, so an existing pool can be shared with the app.
 */
export interface PostgresPool {
  query: (...args: any[]) => Promise<any>
  end?: () => Promise<void>
}

export type PostgresConnection = string | { pool: PostgresPool }

export interface PostgresAdapterConfig {
  /**
   * @description A connection string (`postgres://user:pass@host:5432/db`), or `{ pool }` with an existing `pg` Pool
   */
  connection: PostgresConnection
  /**
   * @description InstantSearch `indexName` -> table. Sorting suffixes (`products_price_asc`) resolve to the index as with Elasticsearch.
   */
  indices: Record<string, PostgresIndexConfig>
}

/**
 * @description The SQL statement built for one InstantSearch request. `params` are bound parameters.
 */
export interface PostgresSearchRequest {
  indexName: string
  text: string
  params: unknown[]
}

/**
 * @description The row returned by the statement for one InstantSearch request.
 */
export type PostgresSearchResponse = Record<string, unknown>

const notImplemented = (method: string) =>
  new Error(
    `@searchkit/adapter-postgres: ${method} is not implemented yet. The Postgres adapter is under development and cannot run searches in this version.`
  )

/**
 * Searchkit adapter for Postgres (Node only): full-text search with `tsvector`, facets with `GROUP BY`
 * and semantic search with pgvector.
 *
 * Work in progress: the adapter validates its configuration, but does not run searches yet
 * (`buildRequest` throws).
 */
export const PostgresAdapter = (
  config: PostgresAdapterConfig
): SearchAdapter<PostgresSearchRequest, PostgresSearchResponse> => {
  if (!config || !config.connection) {
    throw new Error(
      'PostgresAdapter: `connection` is required (a connection string, or `{ pool }` with an existing pg Pool)'
    )
  }
  if (!config.indices || Object.keys(config.indices).length === 0) {
    throw new Error('PostgresAdapter: `indices` must map at least one indexName to a table')
  }

  // created on first use, so building the adapter (e.g. at module load) does not connect
  let pool: PostgresPool | undefined
  const getPool = (): PostgresPool => {
    if (!pool) {
      const { connection } = config
      pool =
        typeof connection === 'string'
          ? new pg.Pool({ connectionString: connection })
          : connection.pool
    }
    return pool
  }

  return {
    name: 'postgres',
    buildRequest() {
      throw notImplemented('buildRequest')
    },
    async execute() {
      getPool()
      throw notImplemented('execute')
    },
    transformResponse() {
      throw notImplemented('transformResponse')
    },
    transformFacetValuesResponse() {
      throw notImplemented('transformFacetValuesResponse')
    }
  }
}
