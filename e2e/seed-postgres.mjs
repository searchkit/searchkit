// Seeds the local Postgres (pgvector) with the same products as e2e/seed.mjs seeds into Elasticsearch: the
// electronics dataset used by examples/with-ui-nextjs-react plus the e2e-only products in
// fixtures/extra-products.json. Hierarchical categories become one column per level, `search_vector` is a
// generated tsvector column (GIN index) and `embedding` is the same 8-dim vector as in Elasticsearch
// (e2e/embedding.mjs).
// Usage: node e2e/seed-postgres.mjs
//   (DATABASE_URL defaults to postgres://postgres:searchkit@localhost:5432/postgres)
// WARNING: drops and recreates the `products` table.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { EMBEDDING_DIMS, embed, productText } from './embedding.mjs'

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:searchkit@localhost:5432/postgres'
const e2eDir = dirname(fileURLToPath(import.meta.url))
const dataFile = join(e2eDir, '..', 'sample-data', 'electronics-ecommerce', 'bulk.json')
const extraProducts = JSON.parse(
  readFileSync(join(e2eDir, 'fixtures', 'extra-products.json'), 'utf8')
)
const BATCH_ROWS = 500

const schema = `
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
DROP TABLE IF EXISTS products;
-- array_to_string() is only STABLE, and a generated column needs an IMMUTABLE expression. It is immutable for
-- text[], so wrap it.
CREATE OR REPLACE FUNCTION searchkit_text_array_to_string(text[]) RETURNS text
  LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$ SELECT array_to_string($1, ' ') $$;
CREATE TABLE products (
  id text PRIMARY KEY,
  name text, description text, brand text, type text,
  categories text[],
  hierarchical_categories_lvl0 text, hierarchical_categories_lvl1 text, hierarchical_categories_lvl2 text,
  price numeric, price_range text, image text, url text, free_shipping boolean, popularity int, rating int,
  embedding vector(${EMBEDDING_DIMS}),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(brand,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(searchkit_text_array_to_string(categories),'')), 'B') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'D')
  ) STORED
);
CREATE INDEX ON products USING gin (search_vector);
CREATE INDEX ON products (brand); CREATE INDEX ON products (hierarchical_categories_lvl0);
CREATE INDEX ON products (hierarchical_categories_lvl1); CREATE INDEX ON products (price);
`

const columns = [
  'id',
  'name',
  'description',
  'brand',
  'type',
  'categories',
  'hierarchical_categories_lvl0',
  'hierarchical_categories_lvl1',
  'hierarchical_categories_lvl2',
  'price',
  'price_range',
  'image',
  'url',
  'free_shipping',
  'popularity',
  'rating',
  'embedding'
]

const toRow = (id, doc) => {
  const levels = doc.hierarchicalCategories ?? {}
  return [
    id,
    doc.name ?? null,
    doc.description ?? null,
    doc.brand ?? null,
    doc.type ?? null,
    doc.categories ?? [],
    levels.lvl0 ?? null,
    levels.lvl1 ?? null,
    levels.lvl2 ?? null,
    doc.price ?? null,
    doc.price_range ?? null,
    doc.image ?? null,
    doc.url ?? null,
    doc.free_shipping ?? null,
    doc.popularity ?? null,
    doc.rating ?? null,
    // pgvector's text input format
    JSON.stringify(embed(productText(doc)))
  ]
}

// bulk.json is ndjson: alternating action / source lines
const lines = readFileSync(dataFile, 'utf8').split('\n').filter(Boolean)
const rows = []
for (let i = 0; i < lines.length; i += 2) {
  const { index } = JSON.parse(lines[i])
  rows.push(toRow(index._id, JSON.parse(lines[i + 1])))
}
for (const { _id, ...doc } of extraProducts) rows.push(toRow(_id, doc))

async function connect(timeoutMs = 120000) {
  const start = Date.now()
  for (;;) {
    const client = new pg.Client({ connectionString })
    try {
      await client.connect()
      return client
    } catch (e) {
      await client.end().catch(() => {})
      if (Date.now() - start > timeoutMs)
        throw new Error(`Postgres not ready at ${connectionString}: ${e.message}`)
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

const client = await connect()
try {
  await client.query('BEGIN')
  await client.query(schema)
  for (let i = 0; i < rows.length; i += BATCH_ROWS) {
    const batch = rows.slice(i, i + BATCH_ROWS)
    const values = batch.map(
      (_, r) => `(${columns.map((_, c) => `$${r * columns.length + c + 1}`).join(', ')})`
    )
    await client.query(
      `INSERT INTO products (${columns.join(', ')}) VALUES ${values.join(', ')}`,
      batch.flat()
    )
  }
  await client.query('COMMIT')
  await client.query('ANALYZE products')

  const { rows: result } = await client.query('SELECT count(*)::int AS count FROM products')
  const { count } = result[0]
  if (count !== rows.length)
    throw new Error(`Expected ${rows.length} rows in "products", found ${count}`)
  const host = new URL(connectionString).host
  console.log(`Seeded ${count} rows into "products" at ${host}`)
} catch (e) {
  await client.query('ROLLBACK').catch(() => {})
  throw e
} finally {
  await client.end()
}
