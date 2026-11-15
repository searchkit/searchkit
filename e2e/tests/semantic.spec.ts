import { expect, test } from '@playwright/test'
import type { APIRequestContext } from '@playwright/test'

// Contract tests for `search_settings.semantic_search` (API level, no UI), on both engines. The example's
// /api/semantic/<mode> route searches with `semantic_search: { field: 'embedding', embed, k: 50, mode }`;
// the seeders store a deterministic 8-dim embedding per product (e2e/embedding.mjs), so no model is needed.
const K = 50

type Hit = { objectID: string; name?: string; brand?: string }
type Result = { hits: Hit[]; nbHits: number }

const search = async (
  request: APIRequestContext,
  path: string,
  params: Record<string, unknown>
): Promise<Result> => {
  const response = await request.post(path, {
    data: [{ indexName: 'products', params: { hitsPerPage: 20, ...params } }]
  })
  expect(response.ok(), `${path} responded ${response.status()}`).toBeTruthy()
  return (await response.json()).results[0]
}

const ids = (result: Result) => result.hits.map((hit) => hit.objectID)

// Elasticsearch hybrid search is `query` + `knn` + `rank.rrf`; reciprocal rank fusion needs a licence
// above Basic (the e2e cluster runs the default Basic licence and answers 403 "current license is
// non-compliant for [Reciprocal Rank Fusion (RRF)]").
const skipHybridOnElasticsearch = () =>
  test.skip(test.info().project.name === 'chromium', 'rrf needs a licensed ES')

test.describe('semantic_search', () => {
  test('text_only ignores the vector: same hits as the plain text search', async ({ request }) => {
    const textOnly = await search(request, '/api/semantic/text_only', { query: 'samsung' })
    const plain = await search(request, '/api/search', { query: 'samsung' })
    expect(textOnly.nbHits).toBeGreaterThan(0)
    expect(textOnly.nbHits).toBe(plain.nbHits)
    expect(ids(textOnly)).toEqual(ids(plain))
  })

  test('an empty query runs no vector search in any mode', async ({ request }) => {
    const plain = await search(request, '/api/search', { query: '' })
    for (const mode of ['hybrid', 'semantic_only', 'text_only']) {
      const result = await search(request, `/api/semantic/${mode}`, { query: '' })
      expect(result.nbHits, mode).toBe(plain.nbHits)
      expect(ids(result), mode).toEqual(ids(plain))
    }
  })

  test('semantic_only returns the k nearest products', async ({ request }) => {
    const result = await search(request, '/api/semantic/semantic_only', { query: 'samsung' })
    expect(result.nbHits).toBeGreaterThan(0)
    expect(result.nbHits).toBeLessThanOrEqual(K)
    expect(result.hits.length).toBeGreaterThan(0)
    for (const hit of result.hits) expect(hit).toHaveProperty('objectID')
  })

  test('semantic_only applies the filters to the vector search', async ({ request }) => {
    const result = await search(request, '/api/semantic/semantic_only', {
      query: 'samsung',
      facetFilters: [['brand:Apple']]
    })
    expect(result.hits.length).toBeGreaterThan(0)
    expect(result.nbHits).toBeLessThanOrEqual(K)
    for (const hit of result.hits) expect(hit.brand).toBe('Apple')
  })

  test('hybrid returns relevant hits, the text matches included', async ({ request }) => {
    skipHybridOnElasticsearch()
    const hybrid = await search(request, '/api/semantic/hybrid', { query: 'samsung' })
    const textOnly = await search(request, '/api/semantic/text_only', { query: 'samsung' })
    expect(hybrid.nbHits).toBeGreaterThan(0)
    // the fused candidates are the text matches plus the k nearest products
    expect(hybrid.nbHits).toBeGreaterThanOrEqual(textOnly.nbHits)
    expect(hybrid.nbHits).toBeLessThanOrEqual(textOnly.nbHits + K)
    for (const hit of hybrid.hits) expect(hit).toHaveProperty('objectID')
    expect(hybrid.hits.some((hit) => /samsung/i.test(`${hit.name} ${hit.brand}`))).toBe(true)
  })

  test('hybrid applies the filters to both searches', async ({ request }) => {
    skipHybridOnElasticsearch()
    const result = await search(request, '/api/semantic/hybrid', {
      query: 'samsung',
      facetFilters: [['brand:Apple']]
    })
    expect(result.hits.length).toBeGreaterThan(0)
    for (const hit of result.hits) expect(hit.brand).toBe('Apple')
  })
})
