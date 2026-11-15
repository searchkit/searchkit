# Plan: Postgres adapter for Searchkit

Status: approved design, phases 1 to 8 implemented (PR to `main` pending). Decisions below were made by the maintainer on 2026-11-15 and are
not open for re-litigation by the implementing agent; questions that come up during implementation and are not
covered here should be raised, not guessed.

Workflow: all phases land on the integration branch `postgres-adapter` (not `main`). Each phase is committed
and pushed to that branch; one PR from `postgres-adapter` to `main` is opened at the end. Nothing is published
to npm until that PR merges, and the implementing agent never publishes.

Revisions after phase 1 (2026-11-15, maintainer decisions):

- Decision 1 revised: a `@searchkit/core` package holds the engine-neutral code and both adapters depend on it.
  `searchkit` depends on core and the ES adapter and re-exports both, so the public `searchkit` import is
  unchanged. This removes the `searchkit` <-> adapter cycle that phase 1 worked around by bundling core sources
  into the adapter via `src/core.ts`; that workaround is to be removed in phase 2.
- Decision 3 revised: this is a major release (v5). `getKnnQuery` is **removed**, not deprecated. Passing it
  throws an error that tells the user to use `semantic_search`. Keep that behaviour.
- Docs pages that still describe `getKnnQuery` are fixed in phase 2, not phase 8.

## Goal

Searchkit currently turns InstantSearch requests into Elasticsearch `_msearch` bodies. This work makes the engine
pluggable through an **adapter** interface and ships a second adapter for **Postgres** (full-text search via
`tsvector`, facets via `GROUP BY`, semantic search via pgvector). The existing Elasticsearch behaviour must not
change, and the existing public API must keep working unchanged.

Success is defined by the end-to-end tests: the Playwright suite in `e2e/` must pass **twice**, once against
Elasticsearch (as today) and once against Postgres, with the same spec files.

## Decisions (fixed)

| #   | Topic                            | Decision                                                                                                                                                                                                                    |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Package layout                   | New packages `@searchkit/adapter-elasticsearch` and `@searchkit/adapter-postgres`. `searchkit` keeps re-exporting the Elasticsearch adapter so `import Searchkit from 'searchkit'` and `connection: { host }` keep working. |
| 2   | ES-typed escape hatches          | `getQuery`, `getBaseFilters`, `beforeSearch`, `afterSearch`, `CustomFacetConfig.facetQuery/filterQuery` stay Elasticsearch-typed. Postgres gets its own SQL-flavoured equivalents. They are not generified.                 |
| 3   | Semantic search                  | `getKnnQuery` is **deprecated**. A new engine-agnostic `search_settings.semantic_search` config replaces it and is implemented by both adapters.                                                                            |
| 4   | Postgres is backend only         | The Postgres adapter runs only on the server. No browser build, no client-side connection. `@searchkit/instantsearch-client` is unaffected (it only talks to the user's API route).                                         |
| 5   | Postgres `field`                 | A plain column name only (optionally schema-qualified table, never an expression). Revisit JSONB paths / expressions after rollout if asked.                                                                                |
| 6   | Multi-valued attributes          | Explicit `array: true` on the facet / filter attribute. No schema introspection.                                                                                                                                            |
| 7   | Hierarchical facets              | Mirror Elasticsearch: one column per level (`lvl0`, `lvl1`, ...).                                                                                                                                                           |
| 8   | `filters` / `QueryFilter` syntax | Write a parser for the documented Lucene-like subset into a shared, engine-neutral filter AST that both adapters compile. No raw SQL in query rules.                                                                        |
| 9   | Full-text strategy               | Prefer a precomputed `tsvector` column (`search_vector_column`); fall back to `to_tsvector()` built from `search_attributes` at query time. `websearch_to_tsquery`. `fuzziness` maps to an opt-in `pg_trgm` similarity.     |
| 10  | pgvector in v1                   | Yes. Hybrid = reciprocal rank fusion (RRF) computed in SQL. Only hybrid mode in v1.                                                                                                                                         |
| 11  | Counts                           | Exact `count(*)` and exact facet counts. No approximation in v1.                                                                                                                                                            |
| 12  | CI                               | Run the full e2e suite twice (ES project + Postgres project).                                                                                                                                                               |
| 13  | Docs                             | Split the docs by adapter: an "Adapters" section with an Elasticsearch page and a Postgres page.                                                                                                                            |

## Target configuration

### Postgres

```ts
import API from '@searchkit/api'
import { PostgresAdapter } from '@searchkit/adapter-postgres'

const apiClient = API({
  adapter: PostgresAdapter({
    // a connection string, or an existing `pg` Pool so the app can share its pool
    connection: process.env.DATABASE_URL, // 'postgres://user:pass@host:5432/db?sslmode=require'
    // connection: { pool: existingPgPool },
    indices: {
      // InstantSearch `indexName` -> table. Sorting suffixes (indexName_price_asc) resolve as today.
      products: {
        table: 'products', // may be schema-qualified: 'shop.products'
        id_column: 'id', // becomes objectID
        search_vector_column: 'search_vector', // optional precomputed tsvector (recommended, needs a GIN index)
        text_search_config: 'english' // regconfig used by websearch_to_tsquery / to_tsvector
      }
    }
  }),
  search_settings: {
    search_attributes: [{ field: 'name', weight: 3 }, { field: 'brand', weight: 2 }, 'description'],
    result_attributes: ['name', 'description', 'brand', 'price', 'image'],
    highlight_attributes: ['name'],
    snippet_attributes: ['description:200'],
    facet_attributes: [
      { attribute: 'brand', field: 'brand', type: 'string' },
      { attribute: 'categories.lvl0', field: 'hierarchical_categories_lvl0', type: 'string' },
      { attribute: 'categories.lvl1', field: 'hierarchical_categories_lvl1', type: 'string' },
      { attribute: 'categories.lvl2', field: 'hierarchical_categories_lvl2', type: 'string' },
      { attribute: 'price', field: 'price', type: 'numeric' }
    ],
    filter_attributes: [
      { attribute: 'categories', field: 'categories', type: 'string', array: true }
    ],
    sorting: {
      default: { field: '_score', order: 'desc' },
      _price_asc: { field: 'price', order: 'asc' },
      _price_desc: [
        { field: 'price', order: 'desc' },
        { field: 'name', order: 'asc' }
      ]
    },
    semantic_search: {
      field: 'embedding', // vector(n) column
      embed: async (query) => embedText(query), // user supplied; returns number[]
      k: 50,
      distance: 'cosine', // 'cosine' | 'l2' | 'inner_product'  (postgres only)
      mode: 'hybrid' // 'hybrid' | 'semantic_only' | 'text_only'
    },
    query_rules: [
      /* unchanged */
    ]
  }
})
```

### Elasticsearch (unchanged behaviour, new explicit form)

```ts
import { ElasticsearchAdapter } from '@searchkit/adapter-elasticsearch'

API({ adapter: ElasticsearchAdapter({ host, apiKey }), search_settings })
// still valid and equivalent:
API({ connection: { host, apiKey }, search_settings })
```

Resolution: `adapter` wins. Otherwise `connection` is wrapped in `ElasticsearchAdapter`; a `connection` with an
`msearch` method is a custom ES `Transporter`, exactly as now.

### `semantic_search` (replaces `getKnnQuery`)

```ts
semantic_search?: {
  /** dense_vector field (ES) or vector column (PG) */
  field: string
  /** How the query becomes a vector. Exactly one of: */
  embed?: (query: string) => Promise<number[]> | number[]
  /** ES only: server-side inference, maps to knn.query_vector_builder.text_embedding */
  model_id?: string
  k?: number // default 50
  num_candidates?: number // ES only, default 2*k
  distance?: 'cosine' | 'l2' | 'inner_product' // PG only, default 'cosine'
  mode?: 'hybrid' | 'semantic_only' | 'text_only' // default 'hybrid'
}
```

- `hybrid`: ES = `query` + `knn` + `rank.rrf` (what `getKnnQuery` + organic query does today). PG = RRF over the
  FTS ranking and the vector ranking, in SQL.
- `semantic_only`: ES = `knn` only (today's `getQuery: () => false` + `getKnnQuery`). PG = `ORDER BY embedding <=> $v`.
- `text_only`: ignore the vector (useful to toggle via env without removing config).
- Empty query: no vector search in any mode (today's behaviour).
- `getKnnQuery` is removed (v5). Passing it throws an error pointing at `semantic_search`.

## Architecture

### Adapter interface (in `packages/searchkit`)

```ts
export interface SearchAdapter<TRequest = unknown, TResponse = unknown> {
  readonly name: string // 'elasticsearch' | 'postgres' | custom
  buildRequest(
    request: MultipleQueriesQuery,
    settings: SearchSettingsConfig,
    rules: QueryRuleActions,
    options?: RequestOptions
  ): TRequest
  execute(requests: TRequest[], settings: AppSettings): Promise<TResponse[]>
  transformResponse(
    response: TResponse,
    request: MultipleQueriesQuery,
    settings: SearchSettingsConfig,
    rules: QueryRuleActions
  ): SearchResponse
  transformFacetValuesResponse(
    response: TResponse,
    request: MultipleQueriesQuery
  ): SearchForFacetValuesResponse
}
```

`Searchkit.handleInstantSearchRequests` becomes: evaluate query rules (core) -> `adapter.buildRequest` per
request -> `hooks.beforeSearch` -> `adapter.execute` -> `hooks.afterSearch` -> `adapter.transformResponse` /
`transformFacetValuesResponse`. Hooks keep their current ES-typed signatures (decision 2); for Postgres the
`SearchRequest.body` is the SQL request object (see below) and hook typings are widened with a generic that
defaults to the ES types.

### What stays in core (`packages/searchkit`)

- All `SearchSettingsConfig` and InstantSearch request/response types.
- Query rule evaluation (`queryRules.ts`) and the `renderingContent` / `userData` response parts.
- Parsing of InstantSearch params into a **filter AST**: `facetFilters`, `numericFilters`, `filters` (string
  grammar), geo params, and query-rule `QueryFilter` strings.
- Sorting option lookup (`getIndexName`, suffix convention).
- Pagination maths (`page`, `nbPages`, `hitsPerPage`).
- Facet lookup helpers (`utils.ts`).

### Filter AST (new, core)

```ts
type FilterNode =
  | { op: 'and' | 'or'; nodes: FilterNode[] }
  | { op: 'not'; node: FilterNode }
  | { op: 'eq'; attribute: string; value: string | number | boolean }
  | { op: 'in'; attribute: string; values: (string | number)[] }
  | { op: 'range'; attribute: string; gte?: number; gt?: number; lte?: number; lt?: number }
  | { op: 'geo_distance'; attribute: string; lat: number; lng: number; radius: number | 'all' }
  | { op: 'geo_bbox'; attribute: string; box: [number, number, number, number] }
  | { op: 'exists'; attribute: string }
```

Nodes carry the InstantSearch **attribute**; each adapter resolves it to its `field` (and ES `nestedPath`) when
compiling. Elasticsearch compiles it to the exact `bool` queries it emits today (verify with the existing Jest
snapshots). Postgres compiles it to a parameterised `WHERE` fragment.

The `filters` string parser must cover what the docs and e2e use: `attr:value`, `attr:"quoted value"`,
`attr:[min TO max]`, `attr:>n` / `attr:<=n` style ranges, `AND` / `OR` / `NOT`, parentheses. The existing
`transformQueryString` attribute-validation errors are preserved. Unknown syntax throws a clear error naming the
unsupported token.

### `@searchkit/adapter-elasticsearch`

A relocation of today's code: `transformRequest.ts`, `transformResponse.ts`, ES compilation parts of `filters.ts`,
`highlightUtils.ts`, `Transporter.ts`, `RelevanceQueryMatch`, runtime mappings, nested paths, `createRegexQuery`.
Plus the `semantic_search` implementation and the `getKnnQuery` deprecation. The existing Jest suite in
`packages/searchkit/src/___tests___` moves with it (or stays and imports from the adapter, whichever keeps the
diff smaller). Behaviour must be byte-identical on the request bodies the functional tests snapshot.

`searchkit` depends on this package and re-exports `ElasticsearchAdapter`, `ESTransporter`, and every type it
exports today.

### `@searchkit/adapter-postgres`

Node only (`"engines": { "node": ">=22.11" }`, no UMD build). Dependency: `pg` (peer or direct; use direct, pin
`^8`). No ORM. Files:

- `PostgresAdapter.ts`: factory + `SearchAdapter` implementation. Owns a `pg.Pool` (created from the URL, or the
  one passed in).
- `sql/identifiers.ts`: every column / table name used in SQL comes from `search_settings` or `indices`; validate
  against `/^[a-z_][a-z0-9_]*$/i` (allow one `.` for schema-qualified tables) and quote with double quotes. Values
  are always bound parameters. There is no code path that interpolates a user-controlled value into SQL.
- `sql/filters.ts`: filter AST -> `{ text, params }`. `array: true` attributes use `= ANY`, `@>`, `&&`; scalar use
  `=`, `IN`, `BETWEEN` / comparison; `not` wraps in `NOT (...)`; geo is out of scope for v1 (throw a clear
  "not supported by the postgres adapter" error if a geo filter is present).
- `sql/query.ts`: the main statement builder (shape below).
- `sql/facets.ts`: one `GROUP BY` CTE per requested facet; numeric facets add `min/max/avg/sum`; `array: true`
  facets `unnest` first; `searchForFacetValues` adds `WHERE value ILIKE $pattern` on the grouped values
  (case-insensitive, like the ES regex include).
- `sql/highlight.ts`: `ts_headline(config, column, tsquery, 'StartSel=<pre>,StopSel=<post>,MaxFragments=...')`
  for highlight and snippet attributes; emits `_highlightResult` / `_snippetResult` in the same shape as the ES
  adapter (`{ value, matchLevel, matchedWords }`).
- `sql/semantic.ts`: vector ranking and RRF.
- `transformResponse.ts`: rows -> Algolia-shaped hits, `facets`, `facets_stats`, `nbHits`.

Postgres `RequestOptions` additions (ES names are not reused, decision 2):

```ts
{
  getWhere?: (query: string, settings) => { text: string; params: unknown[] } // extra AND-ed predicate (permissions)
  getRankExpression?: (query: string, settings) => { text: string; params: unknown[] } // replaces ts_rank_cd(...)
}
```

Statement shape for one InstantSearch request (all `$n` are bound parameters):

```sql
WITH q AS (SELECT websearch_to_tsquery($1, $2) AS tsq),
base AS (
  SELECT p.*, ts_rank_cd(p.search_vector, q.tsq) AS _score
  FROM products p, q
  WHERE ($2 = '' OR p.search_vector @@ q.tsq)
    AND p.brand = ANY($3) AND p.price BETWEEN $4 AND $5      -- compiled filter AST
),
hits AS (SELECT * FROM base ORDER BY _score DESC, id ASC LIMIT $6 OFFSET $7),
total AS (SELECT count(*) AS n FROM base),
facet_brand AS (SELECT brand AS value, count(*) AS n FROM base GROUP BY 1 ORDER BY 2 DESC, 1 ASC LIMIT $8),
facet_price AS (SELECT min(price), max(price), avg(price), sum(price) FROM base),
facet_price_values AS (SELECT price AS value, count(*) AS n FROM base GROUP BY 1 ORDER BY 2 DESC LIMIT $8)
SELECT
  (SELECT json_agg(h) FROM hits h)            AS hits,
  (SELECT n FROM total)                        AS total,
  (SELECT json_agg(f) FROM facet_brand f)      AS "facet:brand",
  (SELECT row_to_json(f) FROM facet_price f)   AS "facet_stats:price",
  (SELECT json_agg(f) FROM facet_price_values f) AS "facet:price";
```

Notes:

- Empty query: no `@@` predicate, `_score` is 0, default sort falls back to `id` (deterministic pagination).
- Query rules: `QueryRewrite` changes `$2`; `QueryFilter` is AST-compiled into `WHERE`; `QueryBoost` adds
  `+ CASE WHEN <ast predicate> THEN $weight ELSE 0 END` to `_score`; `PinnedResult` is applied in the
  `ORDER BY` as `CASE WHEN id = ANY($pinned) THEN array_position($pinned, id) ELSE <big> END` first.
- Hybrid semantic search:

```sql
text AS (SELECT id, row_number() OVER (ORDER BY _score DESC) AS r FROM base WHERE _score > 0),
vec  AS (SELECT id, row_number() OVER (ORDER BY embedding <=> $v) AS r FROM base ORDER BY embedding <=> $v LIMIT $k),
fused AS (
  SELECT id, SUM(1.0 / (60 + r)) AS rrf FROM (SELECT * FROM text UNION ALL SELECT * FROM vec) u GROUP BY id
)
-- hits/total/facets then select from base JOIN fused, ordering by rrf
```

- InstantSearch already sends one extra request per refined disjunctive facet; core fans those out and the adapter
  simply runs N statements. Run them with `Promise.all` on the pool (no transaction needed; reads only).
- Highlighting runs only on the `hits` page, never on `base`.

### `@searchkit/api`

Accepts `adapter` in its config and passes it through. Nothing else changes.

## Example app and e2e

### Example

Parameterise `examples/with-ui-nextjs-react/app/api/search/route.ts`: when `SEARCH_ADAPTER=postgres` and
`DATABASE_URL` are set, build the client with `PostgresAdapter` and the Postgres `search_settings` above
(same attributes, same query rules). Otherwise behave exactly as now. The `search_settings` for the two adapters
differ only in `field` names; keep the shared parts (query rules, sorting, result/highlight attributes) in one
object so they cannot drift.

Add `examples/with-postgres-nextjs` later for docs (a minimal copy); not required for the e2e gate.

### Seeding

`e2e/seed-postgres.mjs` loads `sample-data/electronics-ecommerce/bulk.json` (10,000 products) into:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
DROP TABLE IF EXISTS products;
-- array_to_string() is only STABLE; a generated column needs IMMUTABLE, so wrap it (safe for text[]).
CREATE OR REPLACE FUNCTION searchkit_text_array_to_string(text[]) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$ SELECT array_to_string($1, ' ') $$;
CREATE TABLE products (
  id text PRIMARY KEY,
  name text, description text, brand text, type text,
  categories text[],
  hierarchical_categories_lvl0 text, hierarchical_categories_lvl1 text, hierarchical_categories_lvl2 text,
  price numeric, price_range text, image text, url text, free_shipping boolean, popularity int, rating int,
  embedding vector(8),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(searchkit_text_array_to_string(categories), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'D')
  ) STORED
);
CREATE INDEX ON products USING gin (search_vector);
CREATE INDEX ON products (brand); CREATE INDEX ON products (hierarchical_categories_lvl0);
CREATE INDEX ON products (hierarchical_categories_lvl1); CREATE INDEX ON products (price);
```

`id` is the ES `_id` from the bulk action line. `embedding` is a deterministic 8-dim vector derived from the
document (e.g. hashed token counts, normalised) so the vector spec is reproducible without a model; the e2e
`embed()` uses the same function. Insert with `COPY` or batched multi-row `INSERT`; assert the row count matches
the ES seeder (10,000 sample products plus the 3 e2e fixture products, 10,003 in total).

Done in phase 2: commits `6b396971`, `2ba1fe3b`, `fe0f3e40`. The Postgres Playwright project is gated behind
`E2E_POSTGRES=1` until phase 3 makes it unconditional. `escaped-facet-values.spec.ts` builds its own ES index
in-process, so it passes on the Postgres project without exercising Postgres; phase 3 may skip it on that
project (a `test.skip` keyed on the project name is the one allowed spec change). The example's Postgres
`categories` filter needs `array: true` once phase 4 adds the field to the core types.

### Docker and CI

- `docker-compose.e2e.yml`: add `postgres` service, image `pgvector/pgvector:pg17`, `POSTGRES_PASSWORD=searchkit`,
  port `${E2E_PG_PORT:-5432}`, healthcheck `pg_isready`.
- Root scripts: `e2e:up` seeds both; add `e2e:seed:pg`.
- `.github/workflows/test.yml`: add the postgres service next to elasticsearch; run both seeders.
- `turbo.json` `globalEnv`: add `DATABASE_URL`, `SEARCH_ADAPTER`.

### Playwright

`e2e/playwright.config.ts` gets two projects sharing `testDir`:

| project             | port | webServer env                                                    |
| ------------------- | ---- | ---------------------------------------------------------------- |
| `chromium`          | 3000 | `ES_HOST` (as today)                                             |
| `chromium-postgres` | 3001 | `SEARCH_ADAPTER=postgres`, `DATABASE_URL=postgres://...:5432/..` |

Playwright supports one `webServer` array entry per project (`webServer: [ {...}, {...} ]`), each starting the
same Next.js build on a different port; `baseURL` is set per project. Build the example once, start twice.
`pnpm test:e2e --project=chromium-postgres` runs only the Postgres side.

Spec changes allowed: **none** to existing assertions. Add `e2e/tests/semantic.spec.ts` (API-level, no UI) that
posts a query and asserts hits come back in hybrid mode and that `mode: 'text_only'` yields the FTS order; it runs
on both projects (ES side uses the same 8-dim `dense_vector` field, seeded by `e2e/seed.mjs` with the same
deterministic function, so the ES mapping gains `embedding: { type: dense_vector, dims: 8, index: true,
similarity: cosine }`).

## Phases

Each phase is a set of commits pushed to the `postgres-adapter` branch, with a changeset where the public API
changes. Gates are the commands that must pass before moving on.

### Phase 1: adapter seam, Elasticsearch only (no behaviour change)

1. Add `SearchAdapter`, the filter AST, and the `filters` string parser to `packages/searchkit`.
2. Create `packages/adapter-elasticsearch`; move the ES code there; make it compile the filter AST (existing
   `bool` output must be unchanged).
3. `searchkit` depends on and re-exports it; `Searchkit` constructor resolves `adapter` / `connection`.
4. `@searchkit/api` passes `adapter` through.
5. Add `semantic_search` to the ES adapter; remove `getKnnQuery` (throws with a migration message).
6. Update `examples/with-semantic-search-nextjs` to `semantic_search`.

Gate: `pnpm build && pnpm lint && pnpm typecheck && pnpm test` and `pnpm e2e:up && pnpm test:e2e` all green,
with no changes to the e2e specs or Jest snapshots of ES request bodies.

Done: commits `d527bd89`, `0d7167e2`, `a9ba0467`, `5f328814` on `postgres-adapter`.

### Phase 2: `@searchkit/core`, docs catch-up, Postgres e2e infrastructure

Part A, `@searchkit/core` (revised decision 1):

1. Create `packages/core` (`@searchkit/core`, same tsup / jest / eslint / tsconfig setup, browser-safe, no `pg`,
   no `@elastic/elasticsearch` runtime dependency; type-only imports from `@elastic/elasticsearch` are fine only
   if they do not leak into the built `.d.ts`; otherwise define the needed types locally). Move the engine-neutral
   code there: `SearchAdapter`, `SearchSettingsConfig` and request/response types, filter AST, `parseFilters`,
   InstantSearch param -> AST builders, query rule evaluation, sorting lookup, pagination maths, facet helpers.
2. `@searchkit/adapter-elasticsearch` depends on `@searchkit/core` and deletes `src/core.ts` and the bundling of
   core sources.
3. `searchkit` depends on `@searchkit/core` and `@searchkit/adapter-elasticsearch`, holds the `Searchkit` class,
   and re-exports everything it exports today. `check:dts` must stay self-contained for every package.
4. Changeset: `@searchkit/core` major (new, released alongside v5).

Part B, docs catch-up: every page under `apps/web/pages/docs` that mentions `getKnnQuery` is rewritten to
`semantic_search` (at least `api-documentation/searchkit.mdx`, `tutorials/semantic-search.mdx`,
`guides/customising-query.mdx`, `components/search-box.mdx`, `getting-started/with-react.mdx`). The root
README is already done.

Part C, Postgres e2e infrastructure:

Docker service, seeder, example parameterisation, second Playwright project, CI job changes. The Postgres adapter
can be a stub that throws. Gate: `pnpm e2e:up` seeds 10,000 rows into Postgres; the ES project still passes.

### Phase 3: Postgres search, pagination, hits

Gate: `pnpm test:e2e --project=chromium-postgres tests/search.spec.ts` (except the highlight assertion, which may
be skipped via a `test.fixme` until phase 5 only if it is restored in phase 5).

Done: commits `51e9e6d7`, `05084420`. Notes:

- `escaped-facet-values.spec.ts` is excluded from the Postgres project via project-level `testIgnore` (a
  describe-level `test.skip` got no `testInfo` in Playwright 1.48 and its `afterAll` would delete the shared
  ES index).
- `release.yml`'s verify-published job runs only `--project=chromium` because it has no Postgres service.
- Maintainer decision on the total count: the three exact `toBe(10000)` assertions (`search.spec.ts` "renders
  the full seeded catalogue", `facets.spec.ts` "removing the refinement restores", `api.spec.ts` "applies facet
  filters") only pass on Elasticsearch because ES caps `hits.total` at 10,000 when `track_total_hits` is not
  sent; the data has 10,003 rows. Postgres keeps exact counts (decision 11). Those three assertions become
  `toBeGreaterThanOrEqual(10000)` in phase 4. This is an allowed spec change; the `toBeLessThan(10000)`
  assertions stay as they are.

### Phase 4: facets and filters

Terms facets with counts, `facets_stats`, `facetFilters` incl. `-` negation, `numericFilters`, hierarchical
levels, `searchForFacetValues` (case-insensitive), `filters` string, `array: true`. Gate:
`tests/facets.spec.ts` and `tests/api.spec.ts` on the Postgres project.

Done: commits `b4404755`, `e2c7de90`, `fab299b7`. Notes:

- Facets come back as one `facets` JSON column (`[{ attribute, entries: [{ value, count }], stats }]`, attribute
  names are bound parameters); a search for facet values request runs only `base` and its facet CTE.
- `facetFilters` `-` negation is **not** implemented: Searchkit's core (and the Elasticsearch adapter, pinned by
  `facetFilters.test.ts` "leaves values without an escaped leading '-' unchanged") treats an unescaped `attr:-x` as
  the literal value `-x`, and the escaped `\-x` as `-x`. Postgres follows the same AST. Negation compiles where the
  AST has it (`numericFilters` `!=`, `NOT` in `filters` / `QueryFilter`). Supporting Algolia-style exclusions
  needs a core change that alters the Elasticsearch output, so it is left for a maintainer decision.
- Facet search uses `ILIKE 'q%'` plus, for queries longer than two characters, `ILIKE '% q%'` (a later word),
  approximating the Elasticsearch `include` regex (which only allows letters in the preceding words).
- Remaining `chromium-postgres` failure: `query-rules.spec.ts` "cheap tvs" (the `QueryBoost` LG-first assertion,
  phase 6).

### Phase 5: highlighting and snippets

Gate: full `tests/search.spec.ts` on the Postgres project.

Done: commits `9276d942`, `9c3d2c0f` (the phase 3 `test.fixme` is removed; `search.spec.ts` passes 6/6 on
`chromium-postgres`). Notes:

- `sql/highlight.ts` adds `_highlight` / `_snippet` JSON columns built over the page of hits only
  (`FROM hits CROSS JOIN q` in the final `SELECT`), never on `base`, and only when there is a query. The
  `ts_headline` options (including the request's `highlightPreTag` / `highlightPostTag`, double-quoted with `"`
  doubled) and the attribute names are bound parameters.
- Highlights use `HighlightAll=true` (ES `number_of_fragments: 0`). Snippets use `MaxFragments=1`,
  `MaxWords=round(length / 6)` (at least 2), `MinWords=MaxWords / 2`: the ES adapter asks ES for 5 fragments of
  `fragment_size` characters but returns only the first one (`highlightedMatch[0]`), so there is no fragment
  delimiter in the ES output to mirror and one fragment is the faithful equivalent.
- `_highlightResult` / `_snippetResult` follow `highlightUtils.ts`: a value with tags gets `matchLevel: 'full'`,
  `fullyHighlighted: false` and `matchedWords` read between the tags; no match gives the plain value with
  `matchLevel: 'none'` when the attribute is part of the hit, and is left out otherwise (a snippet-only attribute
  without a match, as in ES). `array: true` attributes are highlighted per value.

### Phase 6: sorting and query rules

Gate: `tests/query-rules.spec.ts` on the Postgres project; a sorting API test added to `api.spec.ts` that runs on
both projects (`indexName: 'products_price_asc'` returns ascending prices).

Done: commits `502d658c`, `dae50795`. `chromium` 28 passed; `chromium-postgres` 22 passed (all specs, with
`escaped-facet-values.spec.ts` ignored by the project config). Notes:

- `QueryBoost`: `_score` becomes `(rank + CASE WHEN <predicate> THEN $w::real ELSE 0 END + ...)::real`, the
  predicate compiled from `parseFilters(boost.query)` with the same compiler as `WHERE`. Additive, as the plan's
  statement-shape notes say (ES `function_score` multiplies by default; with an empty query, as in "cheap tvs",
  both put matching rows first).
- `PinnedResult`: the pinned ids match even when they do not match the text query (filters still apply), like
  an ES `pinned` query, so `nbHits` and facets include them. They come first, in configured order, through
  `array_position($pinned::text[], id::text) AS _pin` and `ORDER BY _pin ASC NULLS LAST, ...` only when the hits
  are sorted by relevance (no sorting option, or one whose first field is `_score desc`); with a field sort ES
  ignores the pinned boost, and so does this adapter.
- `QueryRewrite`, `QueryFilter`, `RenderFacetsOrder` and `RenderUserData` already worked through core; a unit
  test now pins the response parts.
- Sorting: suffix lookup, multi-field options, `_score` as a field and the `nestedPath` / `mode` error were
  already in place (phase 3); tests added. The example's shared settings gain
  `sorting: { _price_asc: { field: 'price', order: 'asc' } }` and `price` in `result_attributes` (needed for the
  API test to read prices; the UI does not render it).

### Phase 7: pgvector / semantic search

Gate: `tests/semantic.spec.ts` on both projects.

Done: commits `62862051`, `d0f53aac`. `chromium` 32 passed, 2 skipped; `chromium-postgres` 28 passed. Notes:

- `sql/semantic.ts`: with a query and `semantic_search` (not `text_only`), `nearest` takes the `k` nearest rows
  that match the filters (`ORDER BY <column> <op> $v::vector LIMIT $k`, the distance expression itself so an
  HNSW / IVFFlat index can be used; `<=>` cosine, `<->` l2, `<#>` inner product). In `hybrid`, `text_ranked`
  numbers the text matches (same filters, `PinnedResult` ids included) and `ranked` fuses both with
  `sum(1.0 / (60 + rank))`; `base` is `t JOIN ranked`, so hits, `total` and facets cover the fused set and `_score`
  is the RRF score. `semantic_only`: `_score` is the negated distance; pinned ids are added with a null rank. The
  vector is bound as the pgvector text form (`[a,b,...]`), since `pg` would send a JS array as `{...}`.
- `embed` is called only when there is a (trimmed, post-`QueryRewrite`) query and the mode is not `text_only`;
  `buildRequest` stays synchronous otherwise. `model_id` (with or without `embed`) throws on Postgres; bad `k`,
  `distance`, `mode`, or a non-numeric vector from `embed` throw clear errors.
- `getWhere` was never implemented in earlier phases; it is now (`RequestOptions.getWhere`, Postgres only):
  `{ text, params }` with its own `$1..$n`, renumbered by `Params.addSql`, AND-ed into `WHERE` and into both
  semantic CTEs. Postgres throws on `getQuery` / `getBaseFilters` / `getKnnQuery`, and the Elasticsearch adapter
  throws on `getWhere`, so a permissions filter is never silently dropped. `getRankExpression` is not implemented.
- The example keeps `/api/search` unchanged (hybrid on every route would have changed the ranking under the
  existing specs) and adds `/api/semantic/[mode]` (hybrid, semantic_only, text_only) with
  `semantic_search: { field: 'embedding', embed, k: 50, mode }` and `brand` in `result_attributes`. `embed` is a
  copy of `e2e/embedding.mjs` in `app/api/embedding.ts` (the published-example copy cannot import from `e2e/`).
  The spec asserts: `text_only` equals `/api/search` (FTS order, nbHits); an empty query equals `/api/search` in
  every mode; `semantic_only` returns at most `k` hits and respects `facetFilters`; `hybrid` returns
  `text nbHits <= nbHits <= text nbHits + k`, a samsung hit on the first page, and respects filters.
- **Elasticsearch licence:** the e2e cluster (8.15.3, default Basic licence) answers `403 current license is
non-compliant for [Reciprocal Rank Fusion (RRF)]` to `knn` + `rank.rrf`, so the two hybrid tests skip on
  `chromium` (`test.skip(project === 'chromium', 'rrf needs a licensed ES')`). Running them on ES would need
  `xpack.license.self_generated.type=trial` on the e2e container (and CI service): a maintainer decision.
- The `e2e/seed.mjs` mapping is `embedding: { type: dense_vector, dims: 8, index: true, similarity: cosine }`
  (verified on the running cluster).
- Gap found, not in this phase's scope: decision 9's `fuzziness` -> `pg_trgm` opt-in was never implemented; the
  Postgres docs list `fuzziness` as ignored.

### Phase 8: docs and release

- `apps/web/pages/docs/_meta.js`: add an `adapters` section with `elasticsearch.mdx` (moved content from
  `proxy-elasticsearch` and `guides/setup-elasticsearch.mdx`, with redirects or stubs left behind) and
  `postgres.mdx` (connection, table requirements, `tsvector` generated column + GIN index, `array: true`,
  hierarchical columns, pgvector setup, limitations: no geo, no nested, no runtime mappings, exact counts).
- `DEVELOPMENT.md`: Postgres e2e instructions and the `E2E_PG_PORT` override.
- Changesets: the existing `.changeset/search-adapters.md` is major for `searchkit`, `@searchkit/api` and
  `@searchkit/adapter-elasticsearch`. Add `@searchkit/core` (major) and `@searchkit/adapter-postgres` (major,
  so every package ships as 5.0.0 together) with a `getKnnQuery` -> `semantic_search` migration note.
- No publishing. Open one PR from `postgres-adapter` to `main`; npm trusted publishing for the new packages is
  the maintainer's job after merge.

Final gate: `pnpm build && pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e` (both projects) green locally
and in CI.

Done: commit `fa54e4be` (plus this note). No PR opened and nothing published (the maintainer opens the PR).
Notes:

- `adapters/elasticsearch.mdx` merges `guides/setup-elasticsearch.mdx` and `proxy-elasticsearch/why.mdx`; both
  old pages remain as short stubs linking to the new anchors, hidden from the sidebar (`display: 'hidden'`), so
  old URLs do not 404. The `proxy-elasticsearch/with-*` pages (Next.js, Express, Cloudflare Workers, own server)
  stay where they are: they describe running the Searchkit API, which both adapters use. Internal docs links
  point at the new page; links in examples, package READMEs and the `Transporter` error message still use the
  old URL (served by the stub).
- `adapters/postgres.mdx` documents the behaviour differences (exact counts, stopword-only queries match nothing,
  no fuzziness / prefix matching, facet search matching, additive `QueryBoost`, ES hybrid licence) and the
  out-of-scope list.
- The changeset keeps all five packages major, with a feature list and a migration section.
- `DEVELOPMENT.md` had a four-backtick fence that turned the whole "End-to-end tests" section into a code block;
  fixed.
- `pnpm --filter web build` passes; the regenerated `apps/web/public/sitemap-0.xml` is reverted, not committed.

### Wrap-up (after phase 8)

- `fuzziness` on Postgres (decision 9) implemented as an opt-in `pg_trgm` match over the `search_attributes`
  columns: `%` predicate OR-ed with the full-text match, a tenth of the best `similarity()` added to the rank.
  The e2e seeder adds `gin_trgm_ops` indexes on `name` and `brand`; the example keeps fuzziness off.
- The e2e Elasticsearch runs with `xpack.license.self_generated.type=trial` (compose and CI) so the hybrid
  (`rank.rrf`) semantic tests run on both engines; the two `test.skip` guards are gone.
- Enabling the licence exposed two Elasticsearch-side bugs in hybrid mode, both fixed in the ES adapter:
  `rank.rrf.window_size` must be `rank_window_size` on ES 8.15, and a highlighter cannot be sent together with
  `rank`, so hybrid requests carry no highlight (their hits get plain `_highlightResult` values). The two KNN
  hybrid snapshots in `packages/searchkit` were updated for exactly those two changes.
- Links to `/docs/guides/setup-elasticsearch` in READMEs, examples and the transporter error message now point
  to `/docs/adapters/elasticsearch`; the `/docs/proxy-elasticsearch/with-*` pages still exist and keep their
  links.
- Final gate: build, lint, typecheck, format, dts checks green; unit tests core 42, adapter-elasticsearch 68,
  adapter-postgres 96, searchkit 68, api 3, instantsearch-client 3; e2e 62 passed, 0 skipped (34 Elasticsearch,
  28 Postgres).

## Out of scope for v1 (say so in docs)

Geo filters, ES `nestedPath`, `runtime_mappings`, custom facet SQL (`CustomFacetConfig` is ES only), approximate
counts, JSONB / expression fields, `semantic_only` + `text_only` beyond the simple implementations above, browser
builds of the Postgres adapter.

## Conventions for the implementing agent

- Work on the `postgres-adapter` branch; never push to `main`, never publish. Add a changeset whenever the
  public API changes (write the `.changeset/*.md` file by hand, following the existing one).
- Keep the ES adapter's emitted request bodies identical; the Jest snapshots are the oracle.
- Never build SQL by string-concatenating values. Identifiers come only from config and are validated + quoted.
- Postgres code is Node-only; do not add it to the `searchkit` UMD bundle or import it from browser code.
- Use `pnpm` (v12) and the Node version in `.nvmrc`; see `DEVELOPMENT.md`.
- When something in this plan turns out to be impossible or would change behaviour, stop and report rather than
  silently narrowing the scope.
