---
'searchkit': minor
---

Searchkit's public types no longer import from `@algolia/client-search`, so TypeScript users no longer need it installed. `MultipleQueriesQuery` (and the deprecated `AlgoliaMultipleQueriesQuery` alias) are now defined by Searchkit and accept Algolia v4 requests, and a new `SearchParams` type is exported for the request params.

`SearchParams` declares the parameters Searchkit reads; other Algolia parameters are still accepted but typed as `unknown`, so code that reads them from a request may need a cast.
