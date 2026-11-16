import { expect, test } from '@playwright/test'

// Contract tests against the /api/search route (searchkit-api + real Elasticsearch),
// independent of the React UI.
test.describe('/api/search', () => {
  test('returns an Algolia compatible response for a search request', async ({ request }) => {
    const response = await request.post('/api/search', {
      data: [{ indexName: 'products', params: { query: 'samsung', hitsPerPage: 5, facets: ['*'] } }]
    })
    expect(response.ok()).toBeTruthy()

    const { results } = await response.json()
    expect(results).toHaveLength(1)
    const [result] = results
    expect(result.hits).toHaveLength(5)
    expect(result.nbHits).toBeGreaterThan(5)
    expect(result.page).toBe(0)
    expect(result.hitsPerPage).toBe(5)
    expect(result.hits[0]).toHaveProperty('objectID')
    expect(result.hits[0]).toHaveProperty('name')
    expect(Object.keys(result.facets)).toEqual(expect.arrayContaining(['categories.lvl0', 'price']))
  })

  test('applies facet filters', async ({ request }) => {
    const search = (facetFilters?: string[][]) =>
      request.post('/api/search', {
        data: [
          {
            indexName: 'products',
            params: {
              query: '',
              hitsPerPage: 1,
              facets: ['*'],
              ...(facetFilters && { facetFilters })
            }
          }
        ]
      })

    const all = (await (await search()).json()).results[0].nbHits
    const filtered = (await (await search([['categories.lvl0:Cell Phones']])).json()).results[0]
      .nbHits

    expect(all).toBe(10000)
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(all)
  })

  test('rejects a request with no instantsearch requests', async ({ request }) => {
    const response = await request.post('/api/search', { data: {} })
    expect(response.ok()).toBeFalsy()
  })
})
