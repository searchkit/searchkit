---
'searchkit': major
'@searchkit/api': major
'@searchkit/adapter-elasticsearch': major
---

Make the search engine pluggable through adapters, and replace `getKnnQuery` with `semantic_search`. The Elasticsearch code moves to the new `@searchkit/adapter-elasticsearch` package, which `searchkit` depends on and re-exports, so existing configurations keep working and send the same Elasticsearch requests.

- `adapter` config option (`searchkit` and `@searchkit/api`): `API({ adapter: ElasticsearchAdapter({ host, apiKey }), search_settings })`. `connection: { host }` (or a custom transporter) still works and is wrapped in `ElasticsearchAdapter`; `adapter` wins when both are set.
- New `search_settings.semantic_search` (`field`, `embed` or `model_id`, `k`, `num_candidates`, `mode: 'hybrid' | 'semantic_only' | 'text_only'`) for KNN / hybrid search.
- New exports: `ElasticsearchAdapter`, the `SearchAdapter` interface, the engine-neutral filter AST types, `parseFilters` and `getFilterAst`.

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
