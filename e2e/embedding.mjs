// Deterministic 8-dimensional "embedding" used by the e2e seeders (Elasticsearch `dense_vector`, Postgres
// pgvector `vector(8)`) and, for queries, by the semantic search e2e tests. It hashes each token into one of
// 8 buckets, counts them and L2-normalises the counts, so the vector search is reproducible without a model.
// Texts with no tokens get a fixed unit vector (cosine similarity is undefined for a zero vector).
export const EMBEDDING_DIMS = 8

const tokenize = (text) => String(text ?? '').toLowerCase().match(/[a-z0-9]+/g) ?? []

// FNV-1a, 32 bit
const hash = (token) => {
  let h = 0x811c9dc5
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** The embedding of a text (a query, or a product's text from `productText`). */
export function embed(text) {
  const vector = new Array(EMBEDDING_DIMS).fill(0)
  for (const token of tokenize(text)) vector[hash(token) % EMBEDDING_DIMS] += 1
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  if (norm === 0) return [1, 0, 0, 0, 0, 0, 0, 0]
  // rounded so both engines store exactly the same values
  return vector.map((v) => Math.round((v / norm) * 1e6) / 1e6)
}

/** The text of a product that is embedded: name, brand, categories and description. */
export const productText = (doc) =>
  [doc.name, doc.brand, ...(doc.categories ?? []), doc.description].filter(Boolean).join(' ')
