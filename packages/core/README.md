# @searchkit/core

The engine-neutral core of [Searchkit](https://www.searchkit.co), shared by the search engine adapters
(`@searchkit/adapter-elasticsearch`, `@searchkit/adapter-postgres`) and the `searchkit` package:

- `SearchSettingsConfig`, the InstantSearch request / response types and the `SearchAdapter` interface
- the engine-neutral filter AST (`FilterNode`), the `filters` string parser (`parseFilters`) and the builders that
  turn InstantSearch `facetFilters`, `numericFilters` and geo params into the AST (`getFilterAst`)
- query rule evaluation, sorting option lookup, pagination maths and facet helpers

You don't need to install it to use Searchkit: `searchkit` and `@searchkit/api` re-export its public types. Use it
directly to write your own adapter:

```ts
import type { SearchAdapter } from '@searchkit/core'
import { getFilterAst, getResultsSize, getPageDetails } from '@searchkit/core'
```

It has no runtime dependencies and works in the browser and in Node.
