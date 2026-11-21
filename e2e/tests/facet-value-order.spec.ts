import { expect, test } from '@playwright/test'
import algoliasearchHelper from 'algoliasearch-helper'
import Searchkit from 'searchkit'
import Client from '@searchkit/instantsearch-client'

const host = (process.env.ES_HOST || 'http://localhost:9200').replace(/\/$/, '')
const apiKey = process.env.ES_API_KEY
const index = 'e2e-facet-value-order'

// The alphabetically first artists are the least common, so with a small facet size ordering by
// count and ordering by term return entirely different values.
const artistCounts: Record<string, number> = {
  'Abbott': 1,
  'Adam Smith': 1,
  'Baker': 1,
  'Beth Smith': 1,
  'Clarke': 2,
  'Davies': 2,
  'Hughes': 5,
  'Yan Smith': 4,
  'Jones': 6,
  'Zoe Smith': 7
}

async function es(path: string, init: RequestInit = {}, allow: number[] = []) {
  const res = await fetch(`${host}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `ApiKey ${apiKey}` }),
      ...init.headers
    }
  })
  if (!res.ok && !allow.includes(res.status)) {
    throw new Error(`${init.method || 'GET'} ${path} -> ${res.status}: ${await res.text()}`)
  }
}

const facets = ['artist', 'artist_alpha', 'credit_alpha']

const createHelper = () => {
  const searchkit = new Searchkit({
    connection: { host, ...(apiKey && { apiKey }) },
    search_settings: {
      search_attributes: ['artist'],
      result_attributes: ['artist'],
      facet_attributes: [
        { attribute: 'artist', field: 'artist', type: 'string' },
        { attribute: 'artist_alpha', field: 'artist', type: 'string', order: 'alpha' },
        {
          attribute: 'credit_alpha',
          field: 'artist',
          nestedPath: 'credits',
          type: 'string',
          order: 'alpha'
        }
      ]
    }
  })
  return algoliasearchHelper(Client(searchkit) as any, index, {
    disjunctiveFacets: facets,
    maxValuesPerFacet: 4
  })
}

const facetValues = (content: any, attribute: string) =>
  (
    content.getFacetValues(attribute, { sortBy: ['name:asc'] }) as { name: string; count: number }[]
  ).map(({ name, count }) => ({ name, count }))

const facetSearch = async (attribute: string, query: string) => {
  const { facetHits } = await createHelper().searchForFacetValues(attribute, query, 10)
  return facetHits.map((hit: { value: string; count: number }) => [hit.value, hit.count])
}

test.describe('facet value order', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async () => {
    await es(`/${index}`, { method: 'DELETE' }, [404])
    await es(`/${index}`, {
      method: 'PUT',
      body: JSON.stringify({
        settings: { number_of_replicas: 0 },
        mappings: {
          properties: {
            artist: { type: 'keyword' },
            credits: { type: 'nested', properties: { artist: { type: 'keyword' } } }
          }
        }
      })
    })
    const body = Object.entries(artistCounts).flatMap(([artist, count]) =>
      Array.from({ length: count }, () => [
        JSON.stringify({ index: {} }),
        JSON.stringify({ artist, credits: [{ artist }] })
      ]).flat()
    )
    await es(`/${index}/_bulk?refresh=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: body.join('\n') + '\n'
    })
  })

  test.afterAll(async () => {
    await es(`/${index}`, { method: 'DELETE' }, [404])
  })

  test('without order, a facet returns its most common values', async () => {
    const { content } = await createHelper().searchOnce({})
    expect(facetValues(content, 'artist')).toEqual([
      { name: 'Hughes', count: 5 },
      { name: 'Jones', count: 6 },
      { name: 'Yan Smith', count: 4 },
      { name: 'Zoe Smith', count: 7 }
    ])
  })

  test("order: 'alpha' returns the alphabetically first values, with their counts", async () => {
    const { content } = await createHelper().searchOnce({})
    const alphabeticallyFirst = [
      { name: 'Abbott', count: 1 },
      { name: 'Adam Smith', count: 1 },
      { name: 'Baker', count: 1 },
      { name: 'Beth Smith', count: 1 }
    ]
    expect(facetValues(content, 'artist_alpha')).toEqual(alphabeticallyFirst)
    expect(facetValues(content, 'credit_alpha')).toEqual(alphabeticallyFirst)
  })

  test("order: 'alpha' still respects a refinement on another facet", async () => {
    const helper = createHelper()
    const { content } = await helper.searchOnce(
      helper.state.addDisjunctiveFacetRefinement('artist', 'Zoe Smith')
    )
    expect(content.nbHits).toBe(7)
    expect(facetValues(content, 'artist_alpha')).toEqual([{ name: 'Zoe Smith', count: 7 }])
  })

  test('facet value search returns matches in the facet order', async () => {
    expect(await facetSearch('artist', 'smith')).toEqual([
      ['Zoe Smith', 7],
      ['Yan Smith', 4],
      ['Adam Smith', 1],
      ['Beth Smith', 1]
    ])
    const alphabetical = [
      ['Adam Smith', 1],
      ['Beth Smith', 1],
      ['Yan Smith', 4],
      ['Zoe Smith', 7]
    ]
    expect(await facetSearch('artist_alpha', 'smith')).toEqual(alphabetical)
    expect(await facetSearch('credit_alpha', 'smith')).toEqual(alphabetical)
  })
})
