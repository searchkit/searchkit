// The deterministic 8-dimensional "embedding" of e2e/embedding.mjs (keep the two identical): the e2e
// seeders store it for every product, and the semantic search route embeds queries with it, so vector
// search is reproducible without a model. A real app calls an embedding model here instead.
const EMBEDDING_DIMS = 8

const tokenize = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g) ?? []

// FNV-1a, 32 bit
const hash = (token: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function embed(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMS).fill(0)
  for (const token of tokenize(text)) vector[hash(token) % EMBEDDING_DIMS] += 1
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0))
  if (norm === 0) return [1, 0, 0, 0, 0, 0, 0, 0]
  return vector.map((v) => Math.round((v / norm) * 1e6) / 1e6)
}
