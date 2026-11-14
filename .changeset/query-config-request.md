---
'searchkit': minor
---

`getQuery` and `getKnnQuery` now receive the InstantSearch request on `config.request` (typed as `QueryConfig`), so custom queries can vary per index, e.g. `config.request.indexName`
