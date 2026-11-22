import { getQueryRulesActionsFromRequest } from '@searchkit/core'
import type { MultipleQueriesQuery, SearchSettingsConfig } from '@searchkit/core'
import { getSnippetOptions } from '../sql/highlight'
import { buildSearchStatement } from '../sql/query'
import { getMatchedWords, transformResponse } from '../transformResponse'

const settings: SearchSettingsConfig = {
  search_attributes: ['name', 'description'],
  result_attributes: ['name', 'brand'],
  highlight_attributes: ['name', 'categories'],
  snippet_attributes: ['description:200', 'brand'],
  filter_attributes: [{ attribute: 'categories', field: 'categories', type: 'string', array: true }]
}

const index = { table: 'products', search_vector_column: 'search_vector' }

const build = (request: MultipleQueriesQuery) =>
  buildSearchStatement(
    request,
    settings,
    getQueryRulesActionsFromRequest([], request, settings),
    index
  )

describe('highlighting and snippets', () => {
  it('runs ts_headline for highlight and snippet attributes on the page of hits', () => {
    const statement = build({
      indexName: 'products',
      params: { query: 'samsung tv', highlightPreTag: '<mark>', highlightPostTag: '</mark>' }
    })
    expect(statement.params).toEqual([
      'english',
      'samsung tv',
      20,
      0,
      'StartSel="<mark>",StopSel="</mark>",HighlightAll=true',
      'name',
      'categories',
      'StartSel="<mark>",StopSel="</mark>",MaxFragments=1,MaxWords=33,MinWords=16',
      'StartSel="<mark>",StopSel="</mark>",MaxFragments=1,MaxWords=17,MinWords=8',
      'description',
      'brand'
    ])
    // never on base: only over the page of hits
    expect(statement.text).toContain('FROM hits CROSS JOIN q')
    const [ctes] = statement.text.split('\nSELECT\n')
    expect(ctes).not.toContain('ts_headline')
    expect(statement.text).toMatchSnapshot()
  })

  it('uses the InstantSearch default tags and quotes tags in the options', () => {
    const statement = build({ indexName: 'products', params: { query: 'tv' } })
    expect(statement.params[4]).toBe(
      'StartSel="<ais-highlight-0000000000>",StopSel="</ais-highlight-0000000000>",HighlightAll=true'
    )
    const quoted = build({
      indexName: 'products',
      params: { query: 'tv', highlightPreTag: '<em class="a,b">', highlightPostTag: '</em>' }
    })
    expect(quoted.params[4]).toBe('StartSel="<em class=""a,b"">",StopSel="</em>",HighlightAll=true')
    // the tags are bound parameters, never in the SQL
    expect(quoted.text).not.toContain('class')
  })

  it('does not highlight without a query', () => {
    const statement = build({ indexName: 'products', params: { query: '' } })
    expect(statement.text).not.toContain('ts_headline')
    expect(statement.params).toEqual([20, 0])
  })

  it('approximates the snippet length in words', () => {
    expect(getSnippetOptions(100)).toBe('MaxFragments=1,MaxWords=17,MinWords=8')
    expect(getSnippetOptions(1)).toBe('MaxFragments=1,MaxWords=2,MinWords=1')
  })
})

describe('_highlightResult / _snippetResult', () => {
  const pre = '<ais-highlight-0000000000>'
  const post = '</ais-highlight-0000000000>'
  const request: MultipleQueriesQuery = { indexName: 'products', params: { query: 'samsung tv' } }

  const transform = (row: Record<string, unknown>, req: MultipleQueriesQuery = request) =>
    transformResponse(
      { hits: [{ id: 'a', _score: 1, _rn: 1, ...row }], total: 1 },
      req,
      settings,
      getQueryRulesActionsFromRequest([], req, settings),
      { idColumn: 'id', index: 'products' }
    ).hits[0]

  it('reads the matched words between the tags', () => {
    expect(getMatchedWords(`${pre}Samsung${post} 4K ${pre}TV${post}`, pre, post)).toEqual([
      'Samsung',
      'TV'
    ])
    expect(getMatchedWords('no match', pre, post)).toEqual([])
    expect(getMatchedWords('<b>a.b</b> a+b', '<b>', '</b>')).toEqual(['a.b'])
  })

  it('returns the highlighted values with matchLevel full, like the Elasticsearch adapter', () => {
    const hit = transform({
      name: 'Samsung 4K TV',
      brand: 'Samsung',
      _highlight: {
        name: `${pre}Samsung${post} 4K ${pre}TV${post}`,
        categories: ['TV & Home Theater', `${pre}TVs${post}`]
      },
      _snippet: {
        description: `the ${pre}Samsung${post} screen`,
        brand: 'Samsung'
      }
    })
    expect(hit._highlightResult).toEqual({
      name: {
        fullyHighlighted: false,
        matchLevel: 'full',
        matchedWords: ['Samsung', 'TV'],
        value: `${pre}Samsung${post} 4K ${pre}TV${post}`
      },
      // an array attribute is matched value by value; it is not a result attribute but has a match
      categories: [
        { matchLevel: 'none', matchedWords: [], value: 'TV & Home Theater' },
        {
          fullyHighlighted: false,
          matchLevel: 'full',
          matchedWords: ['TVs'],
          value: `${pre}TVs${post}`
        }
      ]
    })
    expect(hit._snippetResult).toEqual({
      // not a result attribute, but it has a match
      description: {
        fullyHighlighted: false,
        matchLevel: 'full',
        matchedWords: ['Samsung'],
        value: `the ${pre}Samsung${post} screen`
      },
      // no match: the plain value of the hit
      brand: { matchLevel: 'none', matchedWords: [], value: 'Samsung' }
    })
  })

  it('uses the request tags', () => {
    const req = {
      indexName: 'products',
      params: { query: 'tv', highlightPreTag: '<mark>', highlightPostTag: '</mark>' }
    }
    const hit = transform({ name: 'A TV', _highlight: { name: 'A <mark>TV</mark>' } }, req)
    expect(hit._highlightResult).toEqual({
      name: {
        fullyHighlighted: false,
        matchLevel: 'full',
        matchedWords: ['TV'],
        value: 'A <mark>TV</mark>'
      }
    })
  })

  it('leaves out attributes without a match that are not part of the hit', () => {
    const hit = transform({
      name: 'Sony radio',
      brand: null,
      _highlight: { name: 'Sony radio', categories: null },
      _snippet: { description: 'A radio', brand: '' }
    })
    expect(hit._highlightResult).toEqual({
      name: { matchLevel: 'none', matchedWords: [], value: 'Sony radio' }
    })
    expect(hit._snippetResult).toEqual({
      brand: { matchLevel: 'none', matchedWords: [], value: '' }
    })
  })

  it('returns plain values with matchLevel none without a query', () => {
    const req = { indexName: 'products', params: { query: '' } }
    const hit = transform({ name: 'Sony radio', brand: 'Sony' }, req)
    expect(hit._highlightResult).toEqual({
      name: { matchLevel: 'none', matchedWords: [], value: 'Sony radio' }
    })
    expect(hit._snippetResult).toEqual({
      brand: { matchLevel: 'none', matchedWords: [], value: 'Sony' }
    })
  })
})
