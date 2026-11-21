import { expect, test } from '@playwright/test'
import algoliasearchHelper from 'algoliasearch-helper'
import Searchkit from 'searchkit'
import Client from '@searchkit/instantsearch-client'

const host = (process.env.ES_HOST || 'http://localhost:9200').replace(/\/$/, '')
const apiKey = process.env.ES_API_KEY
const index = 'e2e-facet-search-words'

const authors = [
  'Mendoza, Pedro',
  'Müller, Hans',
  "O'Brien Pedro",
  'R2 Pedro',
  'Ana  Pedrosa',
  'Pedro Alvarez',
  'Hansen',
  'Speedo'
]

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

const createHelper = () => {
  const searchkit = new Searchkit({
    connection: { host, ...(apiKey && { apiKey }) },
    search_settings: {
      search_attributes: ['author'],
      result_attributes: ['author'],
      facet_attributes: [{ attribute: 'author', field: 'author', type: 'string' }]
    }
  })
  return algoliasearchHelper(Client(searchkit) as any, index, { disjunctiveFacets: ['author'] })
}

const facetSearch = async (query: string) => {
  const { facetHits } = await createHelper().searchForFacetValues('author', query, 20)
  return facetHits.map((hit: { value: string }) => hit.value).sort()
}

test.describe('facet search matches the start of any word', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async () => {
    await es(`/${index}`, { method: 'DELETE' }, [404])
    await es(`/${index}`, {
      method: 'PUT',
      body: JSON.stringify({
        settings: { number_of_replicas: 0 },
        mappings: { properties: { author: { type: 'keyword' } } }
      })
    })
    const body = authors.flatMap((author) => [
      JSON.stringify({ index: {} }),
      JSON.stringify({ author })
    ])
    await es(`/${index}/_bulk?refresh=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: body.join('\n') + '\n'
    })
  })

  test.afterAll(async () => {
    await es(`/${index}`, { method: 'DELETE' }, [404])
  })

  test('a word after a comma, an apostrophe, a digit or a double space', async () => {
    expect(await facetSearch('ped')).toEqual(
      ['Ana  Pedrosa', 'Mendoza, Pedro', "O'Brien Pedro", 'Pedro Alvarez', 'R2 Pedro'].sort()
    )
  })

  test('a word after a non-ASCII word', async () => {
    expect(await facetSearch('Hans')).toEqual(['Hansen', 'Müller, Hans'])
  })

  test('does not match inside a word', async () => {
    expect(await facetSearch('eed')).toEqual([])
  })
})
