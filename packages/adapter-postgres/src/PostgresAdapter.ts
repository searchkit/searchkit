import pg from 'pg'
import { getIndexName } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchAdapter, SearchSettingsConfig } from '@searchkit/core'
import { quoteColumn, quoteTable } from './sql/identifiers'
import { buildSearchStatement, DEFAULT_ID_COLUMN } from './sql/query'
import type { PostgresIndexConfig } from './sql/query'
import { transformFacetValuesResponse, transformResponse } from './transformResponse'
import type { PostgresSearchResponse } from './transformResponse'

export type { PostgresIndexConfig } from './sql/query'
export type { PostgresFacetResult, PostgresSearchResponse } from './transformResponse'

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
 * @description The SQL statement built for one InstantSearch request (what the `beforeSearch` / `afterSearch`
 * hooks receive). `text` holds only SQL and quoted identifiers from the configuration; every value is in
 * `params`, bound as `$1`, `$2`, ...
 */
export interface PostgresSearchRequest {
  /** The SQL statement */
  text: string
  /** The bound parameters of `text` */
  params: unknown[]
  /** The InstantSearch request the statement was built for */
  request: MultipleQueriesQuery
  /** The configured index (key of `indices`) the request resolved to, without a sorting suffix */
  indexName: string
}

/**
 * Searchkit adapter for Postgres (Node only): full-text search with `tsvector` and `websearch_to_tsquery`,
 * exact `count(*)` totals, `LIMIT` / `OFFSET` pagination, facets with `GROUP BY` (exact counts),
 * search for facet values, and highlighting / snippets with `ts_headline`.
 *
 * Work in progress: query rule boosts / pinned results and semantic search are not implemented yet.
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
  // fail on a bad identifier when the adapter is created, not on the first search
  for (const index of Object.values(config.indices)) {
    quoteTable(index.table)
    quoteColumn(index.id_column || DEFAULT_ID_COLUMN)
    if (index.search_vector_column) quoteColumn(index.search_vector_column)
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

  const getIndex = (request: MultipleQueriesQuery, settings: SearchSettingsConfig) => {
    const indexName = getIndexName(request.indexName, settings)
    const index = config.indices[indexName]
    if (!index) {
      throw new Error(
        `@searchkit/adapter-postgres: no table configured for indexName "${indexName}". Add it to \`indices\` (configured: ${Object.keys(
          config.indices
        )
          .map((name) => `"${name}"`)
          .join(', ')}).`
      )
    }
    return { indexName, index }
  }

  return {
    name: 'postgres',

    buildRequest(request, settings, rules) {
      const { indexName, index } = getIndex(request, settings)
      const { text, params } = buildSearchStatement(request, settings, rules, index)
      return { text, params, request, indexName }
    },

    async execute(requests, settings) {
      const db = getPool()
      if (settings.debug) {
        console.log('Performing search with requests:')
        for (const { indexName, text, params } of requests) {
          console.log(`-- index: ${indexName}\n${text};\n-- params: ${JSON.stringify(params)}`)
        }
      }

      const responses = await Promise.all(
        requests.map(async ({ indexName, text, params }) => {
          const start = Date.now()
          try {
            const result = await db.query(text, params)
            return { ...result.rows[0], took: Date.now() - start } as PostgresSearchResponse
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e)
            const error = new Error(
              `@searchkit/adapter-postgres: query for index "${indexName}" failed: ${message}${
                settings.debug
                  ? `\nSQL:\n${text}\nParams: ${JSON.stringify(params)}`
                  : ' (enable debug mode to log the SQL)'
              }`
            )
            // the pg error (code, position, ...)
            ;(error as Error & { cause?: unknown }).cause = e
            throw error
          }
        })
      )

      if (settings.debug) {
        console.log('Postgres response:')
        console.log(JSON.stringify(responses))
      }
      return responses
    },

    transformResponse(response, request, settings, rules) {
      const { index } = getIndex(request, settings)
      return transformResponse(response, request, settings, rules, {
        idColumn: index.id_column || DEFAULT_ID_COLUMN,
        index: index.table
      })
    },

    transformFacetValuesResponse(response, request) {
      return transformFacetValuesResponse(response, request)
    }
  }
}
