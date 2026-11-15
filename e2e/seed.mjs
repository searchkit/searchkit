// Seeds the local Elasticsearch with the electronics dataset used by examples/with-ui-nextjs-react,
// plus the e2e-only products in fixtures/extra-products.json (edge cases the dataset lacks, such as
// a brand starting with "-"). Each document also gets an 8-dim `embedding` (dense_vector) from
// e2e/embedding.mjs, the same vectors e2e/seed-postgres.mjs stores in Postgres.
// Usage: node e2e/seed.mjs   (ES_HOST defaults to http://localhost:9200)
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EMBEDDING_DIMS, embed, productText } from './embedding.mjs'

const host = (process.env.ES_HOST || 'http://localhost:9200').replace(/\/$/, '')
const index = 'products'
const e2eDir = dirname(fileURLToPath(import.meta.url))
const dataFile = join(e2eDir, '..', 'sample-data', 'electronics-ecommerce', 'bulk.json')
const extraProducts = JSON.parse(
  readFileSync(join(e2eDir, 'fixtures', 'extra-products.json'), 'utf8')
)
const CHUNK_DOCS = 1000

const headers = { 'Content-Type': 'application/json' }
if (process.env.ES_API_KEY) headers.Authorization = `ApiKey ${process.env.ES_API_KEY}`

async function es(path, options = {}) {
  const res = await fetch(`${host}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  })
  const text = await res.text()
  if (!res.ok && !(options.allow || []).includes(res.status)) {
    throw new Error(`${options.method || 'GET'} ${path} -> ${res.status}: ${text.slice(0, 500)}`)
  }
  return text ? JSON.parse(text) : {}
}

async function waitForEs(timeoutMs = 120000) {
  const start = Date.now()
  for (;;) {
    try {
      const health = await es('/_cluster/health?wait_for_status=yellow&timeout=5s')
      if (health.status === 'green' || health.status === 'yellow') return
    } catch (e) {
      if (Date.now() - start > timeoutMs)
        throw new Error(`Elasticsearch not ready at ${host}: ${e.message}`)
    }
    await new Promise((r) => setTimeout(r, 2000))
  }
}

await waitForEs()

// bulk.json is ndjson: alternating action / source lines
const withEmbedding = (doc) => ({ ...doc, embedding: embed(productText(doc)) })
const lines = [
  ...readFileSync(dataFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line, i) => (i % 2 === 0 ? line : JSON.stringify(withEmbedding(JSON.parse(line))))),
  ...extraProducts.flatMap(({ _id, ...doc }) => [
    JSON.stringify({ index: { _index: index, _id } }),
    JSON.stringify(withEmbedding(doc))
  ])
]
const expected = lines.length / 2

await es(`/${index}`, { method: 'DELETE', allow: [404] })
await es(`/${index}`, {
  method: 'PUT',
  body: JSON.stringify({
    settings: { number_of_replicas: 0 },
    // every other field is mapped dynamically, as before
    mappings: {
      properties: {
        embedding: { type: 'dense_vector', dims: EMBEDDING_DIMS, index: true, similarity: 'cosine' }
      }
    }
  })
})

for (let i = 0; i < lines.length; i += CHUNK_DOCS * 2) {
  const body = lines.slice(i, i + CHUNK_DOCS * 2).join('\n') + '\n'
  const result = await es('/_bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-ndjson' },
    body
  })
  if (result.errors) {
    const failed = result.items.find((item) => item.index && item.index.error)
    throw new Error(`Bulk indexing failed: ${JSON.stringify(failed)}`)
  }
}

await es(`/${index}/_refresh`, { method: 'POST' })
const { count } = await es(`/${index}/_count`)
if (count !== expected)
  throw new Error(`Expected ${expected} documents in "${index}", found ${count}`)
console.log(`Seeded ${count} documents into "${index}" at ${host}`)
