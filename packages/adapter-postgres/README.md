# @searchkit/adapter-postgres

> **Work in progress.** This package is under development. It runs full-text searches with filters, sorting and
> pagination; facets, highlighting, query rule boosts / pinned results and semantic search are not implemented yet.

The Postgres adapter for [Searchkit](https://www.searchkit.co): full-text search with `tsvector`, facets with
`GROUP BY` and semantic search with pgvector. It runs on the server only (Node 22.11+), for example in the API route
that `@searchkit/instantsearch-client` talks to.

```ts
import API from '@searchkit/api'
import { PostgresAdapter } from '@searchkit/adapter-postgres'

const apiClient = API({
  adapter: PostgresAdapter({
    // a connection string, or { pool } with an existing pg Pool
    connection: process.env.DATABASE_URL,
    indices: {
      products: {
        table: 'products',
        id_column: 'id',
        search_vector_column: 'search_vector',
        text_search_config: 'english'
      }
    }
  }),
  search_settings: {
    search_attributes: ['name', 'description'],
    result_attributes: ['name', 'description']
  }
})
```

Every table and column name comes from this configuration or the search settings, is validated
(`/^[a-z_][a-z0-9_]*$/i`, plus one `.` for a schema-qualified table) and double-quoted; every value from the
request is a bound parameter. The `beforeSearch` / `afterSearch` hooks receive one request object per InstantSearch
request, `{ text, params, request, indexName }` (`text` is the SQL statement, `params` its bound parameters), and
the matching result rows.
