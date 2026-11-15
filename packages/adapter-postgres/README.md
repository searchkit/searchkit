# @searchkit/adapter-postgres

> **Work in progress.** This package is under development. It runs full-text searches with filters, facets, sorting
> and pagination, with highlighting and snippets (`ts_headline`) and query rules; semantic search is not
> implemented yet.

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

## Facets and filters

Facet and filter attributes map to plain columns (`field` is a column name). Facet counts are exact: each requested
facet is a `GROUP BY` over the matching rows, with values ordered by count, then value, up to `maxValuesPerFacet`
(default 10). Numeric facets also return `facets_stats` (`min`, `max`, `avg`, `sum`). Hierarchical facets use one
column per level, like the Elasticsearch adapter's `lvl0`, `lvl1`, ... fields. `date` facets are not aggregated,
as with Elasticsearch.

Mark an array column (e.g. `text[]`) with `array: true`. Its facet counts each row once per distinct value, and
filters match a row when any of its values matches (`@>` / `&&`), like a multi-valued field in Elasticsearch:

```ts
search_settings: {
  facet_attributes: [
    { attribute: 'brand', field: 'brand', type: 'string' },
    { attribute: 'categories.lvl0', field: 'hierarchical_categories_lvl0', type: 'string' },
    { attribute: 'categories.lvl1', field: 'hierarchical_categories_lvl1', type: 'string' },
    { attribute: 'price', field: 'price', type: 'numeric' }
  ],
  filter_attributes: [{ attribute: 'categories', field: 'categories', type: 'string', array: true }]
}
```

`facetFilters`, `numericFilters`, the `filters` string and `QueryFilter` query rules all compile to a parameterised
`WHERE`. Searching for facet values (`searchForFacetValues`) matches the start of the value, or for queries longer
than two characters the start of any later word, case-insensitively (`ILIKE`, with `%`, `_` and `\` matched
literally). Not supported: geo filters, nested fields (`nestedPath`) and custom facets (`CustomFacetConfig`), which
are Elasticsearch only.

## Security and hooks

Every table and column name comes from this configuration or the search settings, is validated
(`/^[a-z_][a-z0-9_]*$/i`, plus one `.` for a schema-qualified table) and double-quoted; every value from the
request is a bound parameter. The `beforeSearch` / `afterSearch` hooks receive one request object per InstantSearch
request, `{ text, params, request, indexName }` (`text` is the SQL statement, `params` its bound parameters), and
the matching result rows (`{ hits, total, facets }`; a search for facet values request returns only `facets`).
