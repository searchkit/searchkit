---
'searchkit': minor
'@searchkit/api': minor
'@searchkit/adapter-elasticsearch': minor
---

Make the search engine pluggable through adapters. The Elasticsearch code moves to the new `@searchkit/adapter-elasticsearch` package, which `searchkit` depends on and re-exports, so existing configurations keep working unchanged and send the same Elasticsearch requests.

- `adapter` config option (`searchkit` and `@searchkit/api`): `API({ adapter: ElasticsearchAdapter({ host, apiKey }), search_settings })`. `connection: { host }` (or a custom transporter) still works and is wrapped in `ElasticsearchAdapter`; `adapter` wins when both are set.
- New `search_settings.semantic_search` (`field`, `embed` or `model_id`, `k`, `num_candidates`, `mode: 'hybrid' | 'semantic_only' | 'text_only'`) for KNN / hybrid search.
- `getKnnQuery` is deprecated in favour of `semantic_search`. It still works (and wins if both are set) and logs a deprecation warning once.
- New exports: `ElasticsearchAdapter`, the `SearchAdapter` interface, the engine-neutral filter AST types, `parseFilters` and `getFilterAst`.
