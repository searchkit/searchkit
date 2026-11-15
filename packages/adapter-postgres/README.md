# @searchkit/adapter-postgres

> **Work in progress.** This package is under development and does not run searches yet: `buildRequest` throws
> "not implemented yet". Use `@searchkit/adapter-elasticsearch` (the default in `searchkit` / `@searchkit/api`).

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
