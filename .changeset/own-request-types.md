---
'searchkit': patch
---

Searchkit's public types no longer import from `@algolia/client-search`. `MultipleQueriesQuery` (and the deprecated `AlgoliaMultipleQueriesQuery` alias) are now defined by Searchkit and stay compatible with Algolia v4 requests, so TypeScript users no longer need `@algolia/client-search` installed. A new `SearchParams` type is exported for the request params.
