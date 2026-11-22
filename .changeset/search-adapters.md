---
'searchkit': major
'@searchkit/api': major
'@searchkit/adapter-elasticsearch': major
'@searchkit/core': major
'@searchkit/adapter-postgres': major
---

Make the search engine pluggable through adapters, add a Postgres adapter, and replace `getKnnQuery` with `semantic_search`. The Elasticsearch code moves to the new `@searchkit/adapter-elasticsearch` package, which `searchkit` depends on and re-exports, so existing configurations keep working and send the same Elasticsearch requests.

The engine-neutral code (search settings and InstantSearch types, the `SearchAdapter` interface, the filter AST and `filters` parser, query rules, sorting and pagination helpers) moves to the new `@searchkit/core` package, which both `searchkit` and the adapters depend on. `searchkit` and `@searchkit/api` re-export the same names as before, so imports from them don't change; import from `@searchkit/core` to write your own adapter.

### Features

- **Postgres adapter**, new `@searchkit/adapter-postgres` package (Node only): `API({ adapter: PostgresAdapter({ connection: process.env.DATABASE_URL, indices: { products: { table: 'products', search_vector_column: 'search_vector' } } }), search_settings })`. Full-text search (`tsvector`, `websearch_to_tsquery`, `ts_rank_cd`), exact counts and facet counts (`GROUP BY`), `facets_stats`, search for facet values, filters, sorting, highlighting and snippets (`ts_headline`), query rules, and semantic search with pgvector. `connection` is a connection string or `{ pool }` with an existing `pg` Pool. Its `beforeSearch` / `afterSearch` hooks receive `{ text, params, request, indexName }`: the parameterised SQL statement of each request and its bound parameters. See https://www.searchkit.co/docs/adapters/postgres.
- **`adapter` config option** (`searchkit` and `@searchkit/api`): `API({ adapter: ElasticsearchAdapter({ host, apiKey }), search_settings })`. `connection: { host }` (or a custom transporter) still works and is wrapped in `ElasticsearchAdapter`; `adapter` wins when both are set.
- **`search_settings.semantic_search`** for KNN / hybrid search on both engines: `field`, `embed` (a function returning the query vector) or `model_id` (Elasticsearch only), `k` (default 50), `num_candidates` (Elasticsearch only), `distance: 'cosine' | 'l2' | 'inner_product'` (Postgres only) and `mode: 'hybrid' | 'semantic_only' | 'text_only'`. Postgres computes hybrid reciprocal rank fusion in SQL; Elasticsearch uses `rank.rrf`, which needs a licence above Basic.
- **`getWhere` request option** (Postgres only): an extra SQL predicate (`{ text, params }`) AND-ed with the filters of every search, e.g. for permissions. The Elasticsearch-only `getQuery` and `getBaseFilters` throw with the Postgres adapter, and `getWhere` throws with the Elasticsearch adapter, instead of being silently ignored.
- **`array: true`** on facet and filter attributes (Postgres adapter only, ignored by Elasticsearch): marks an array column, so its facet is unnested and its filters use array operators.
- **`fuzziness` on Postgres** (opt-in, `pg_trgm`): when set, a row also matches when a `search_attributes` column is similar to the query (`%`), and a tenth of the best `similarity()` is added to the rank.
- New exports: `ElasticsearchAdapter`, the `SearchAdapter` interface, the engine-neutral filter AST types, `parseFilters` and `getFilterAst`.

### Fixes

- Hybrid semantic search on Elasticsearch sent `rank.rrf.window_size`, which Elasticsearch 8.15 rejects (`unknown field [window_size] did you mean [rank_window_size]?`). It now sends `rank_window_size`. Hybrid requests also no longer include a highlighter, which Elasticsearch rejects together with `rank`; their hits carry plain `_highlightResult` values (matchLevel `none`). Both were hidden before because reciprocal rank fusion needs a licence above Basic.

### Migration

**Breaking:** the `getKnnQuery` request option is removed; passing it throws an error. Move the KNN query to `search_settings.semantic_search`:

```ts
// before
apiClient.handleRequest(body, {
  getKnnQuery: (query) => ({
    field: 'embedding',
    k: 10,
    num_candidates: 100,
    query_vector_builder: { text_embedding: { model_id: 'my-model', model_text: query } }
  })
})

// after
API({
  connection,
  search_settings: {
    // ...
    semantic_search: { field: 'embedding', model_id: 'my-model', k: 10, num_candidates: 100 }
  }
})
```

Use `embed: async (query) => vector` instead of `model_id` to embed the query yourself (`query_vector`), and `mode: 'semantic_only'` instead of `getQuery: () => false` for vector search only. The Elasticsearch request is the same as with the equivalent `getKnnQuery`.

Nothing else needs to change: `connection` (an Elasticsearch connection or a custom `Transporter`) still works, and every name `searchkit` and `@searchkit/api` exported before is still exported. The new packages (`@searchkit/core`, `@searchkit/adapter-elasticsearch`) are installed as dependencies of `searchkit`; install `@searchkit/adapter-postgres` only to search Postgres. The "Setup Elasticsearch" and "Why Proxy Elasticsearch?" docs pages moved to https://www.searchkit.co/docs/adapters/elasticsearch.
