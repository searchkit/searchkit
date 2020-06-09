import fetch from 'node-fetch'
import SearchkitRequest from '../SearchkitRequest'
import QueryManager from '../QueryManager'

jest.mock('node-fetch', () =>
  jest.fn().mockImplementation(() => ({
    json: jest.fn(() => ({
      response: 'ES'
    }))
  }))
)

describe('SearchkitRequest', () => {
  it('should', async () => {
    const qm = new QueryManager([], '')
    const sr = new SearchkitRequest(qm, {
      host: 'http://host-url',
      hits: {
        fields: ['title']
      }
    })
    const x = sr.search({
      aggs: { field: 'term' }
    })
    const y = sr.search({ size: 10 })
    const result = await Promise.all([x, y])
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('http://host-url')
    expect(fetch.mock.calls[0][1].body).toBe(
      JSON.stringify({ size: 10, post_filter: { bool: { must: [] } }, aggs: { field: 'term' } })
    )
    expect(result[0]).toEqual({ response: 'ES' })
    expect(result[1]).toBe(result[0])
  })
})
