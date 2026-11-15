import { createRequire } from 'node:module'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { expect, test } from '@playwright/test'
import algoliasearchHelper from 'algoliasearch-helper'
import type SearchkitClass from 'searchkit'
import type ClientFn from '@searchkit/instantsearch-client'

// The release workflow's verify-published job sets E2E_APP_DIR to the example with searchkit installed from npm
// (and doesn't build the workspace), so resolve the packages from there to test the published build.
const resolveFrom = createRequire(join(process.env.E2E_APP_DIR || __dirname, 'index.js')).resolve
const load = async (name: string) => {
  // resolve() picks the CJS build where there is one; import() then exposes module.exports as `default`
  const { default: mod } = await import(pathToFileURL(resolveFrom(name)).href)
  return mod.default ?? mod
}
let Searchkit: typeof SearchkitClass
let Client: typeof ClientFn

const host = (process.env.ES_HOST || 'http://localhost:9200').replace(/\/$/, '')
const apiKey = process.env.ES_API_KEY
const index = 'e2e-escaped-facet-values'

const docs = [
  { band: '-10 to 0', sensor: 'a' },
  { band: '-10 to 0', sensor: 'b' },
  { band: '-5', sensor: 'a' },
  { band: '0 to 10', sensor: 'a' },
  { band: '0 to 10', sensor: 'b' },
  { band: '0 to 10', sensor: 'c' }
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

const createHelper = (facetType: 'disjunctive' | 'conjunctive') => {
  const searchkit = new Searchkit({
    connection: { host, ...(apiKey && { apiKey }) },
    search_settings: {
      search_attributes: ['sensor'],
      result_attributes: ['band', 'sensor'],
      facet_attributes: [{ attribute: 'band', field: 'band', type: 'string' }],
      query_rules: [
        {
          id: 'below-zero',
          conditions: [
            [{ context: 'filterPresent', values: [{ attribute: 'band', value: '-10 to 0' }] }]
          ],
          actions: [{ action: 'RenderUserData', userData: JSON.stringify({ banner: 'cold' }) }]
        }
      ]
    }
  })
  return algoliasearchHelper(Client(searchkit) as any, index, {
    ...(facetType === 'disjunctive' ? { disjunctiveFacets: ['band'] } : { facets: ['band'] })
  })
}

const refine = (
  helper: ReturnType<typeof createHelper>,
  facetType: 'disjunctive' | 'conjunctive',
  value: string
) =>
  facetType === 'disjunctive'
    ? helper.state.addDisjunctiveFacetRefinement('band', value)
    : helper.state.addFacetRefinement('band', value)

test.describe('facet values starting with "-"', () => {
  // the tests share one index, so keep them in one worker
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async () => {
    Searchkit = await load('searchkit')
    Client = await load('@searchkit/instantsearch-client')
    await es(`/${index}`, { method: 'DELETE' }, [404])
    await es(`/${index}`, {
      method: 'PUT',
      body: JSON.stringify({
        settings: { number_of_replicas: 0 },
        mappings: { properties: { band: { type: 'keyword' }, sensor: { type: 'keyword' } } }
      })
    })
    const body = docs.flatMap((doc) => [JSON.stringify({ index: {} }), JSON.stringify(doc)])
    await es(`/${index}/_bulk?refresh=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body: body.join('\n') + '\n'
    })
  })

  test.afterAll(async () => {
    await es(`/${index}`, { method: 'DELETE' }, [404])
  })

  for (const facetType of ['disjunctive', 'conjunctive'] as const) {
    test(`${facetType}: refining each value returns as many hits as its facet count`, async () => {
      const helper = createHelper(facetType)
      const { content } = await helper.searchOnce({})
      const values = content.getFacetValues('band', {}) as {
        name: string
        escapedValue: string
        count: number
      }[]

      expect(
        values.map(({ name, escapedValue, count }) => ({ name, escapedValue, count }))
      ).toEqual(
        expect.arrayContaining([
          { name: '-10 to 0', escapedValue: '\\-10 to 0', count: 2 },
          { name: '-5', escapedValue: '\\-5', count: 1 },
          { name: '0 to 10', escapedValue: '0 to 10', count: 3 }
        ])
      )

      for (const { name, escapedValue, count } of values) {
        const { content: refined } = await helper.searchOnce(
          refine(helper, facetType, escapedValue)
        )
        expect(refined.nbHits, `hits for "${name}"`).toBe(count)
        expect(refined.hits.every((hit: any) => hit.band === name)).toBe(true)
      }
    })

    test(`${facetType}: a query rule on a "-" value fires when it is refined`, async () => {
      const helper = createHelper(facetType)
      const { content: cold } = await helper.searchOnce(refine(helper, facetType, '\\-10 to 0'))
      expect(cold.userData).toEqual([{ banner: 'cold' }])

      const { content: warm } = await helper.searchOnce(refine(helper, facetType, '0 to 10'))
      expect(warm.userData ?? []).toEqual([])
    })
  }

  test('disjunctive: refining several "-" values ORs them together', async () => {
    const helper = createHelper('disjunctive')
    const state = helper.state
      .addDisjunctiveFacetRefinement('band', '\\-10 to 0')
      .addDisjunctiveFacetRefinement('band', '\\-5')
    const { content } = await helper.searchOnce(state)
    expect(content.nbHits).toBe(3)
  })

  test('combines a "-" refinement with a query', async () => {
    const helper = createHelper('disjunctive')
    const { content } = await helper.searchOnce(
      refine(helper, 'disjunctive', '\\-10 to 0').setQuery('b')
    )
    expect(content.nbHits).toBe(1)
    expect(content.hits[0]).toMatchObject({ band: '-10 to 0', sensor: 'b' })
  })
})
