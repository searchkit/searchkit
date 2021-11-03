import { Client } from '@elastic/elasticsearch'
import SearchkitRequest from '../SearchkitRequest'
import QueryManager from '../QueryManager'

const esClientSearch = jest.fn(() => Promise.resolve('ES'))

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn(() => ({
    search: esClientSearch
  }))
}))

describe('SearchkitRequest', () => {
  const refConsoleLog = console.log
  beforeEach(() => {
    window.console.log = jest.fn()
  })

  afterEach(() => {
    window.console.log = refConsoleLog
  })

  it('should', async () => {
    const qm = new QueryManager([], '', null)
    const sr = new SearchkitRequest(
      qm,
      {
        host: 'http://host-url',
        index: 'movies',
        hits: {
          fields: ['title']
        }
      },
      [],
      []
    )
    const x = await sr.search({
      aggs: { field: 'term' }
    })
    expect(Client).toHaveBeenCalledTimes(1)
  })

  describe('postProcessRequest', () => {
    it('should', async () => {
      const postProcessRequest = jest.fn((body) => ({ ...body, min_score: 10 }))
      const qm = new QueryManager([], '', null)
      const sr = new SearchkitRequest(
        qm,
        {
          host: 'http://host-url',
          index: 'movies',
          hits: {
            fields: ['title']
          },
          postProcessRequest
        },
        [],
        []
      )
      const x = await sr.search({
        aggs: { field: 'term' }
      })
      expect(postProcessRequest).toHaveBeenLastCalledWith({
        aggs: { field: 'term' },
        size: 0
      })
      expect(esClientSearch).toHaveBeenLastCalledWith({
        body: { aggs: { field: 'term' }, min_score: 10, size: 0 },
        index: 'movies'
      })
      expect(window.console.log).not.toBeCalled()
    })

    it("debug mode", async () => {
      process.env.DEBUG_MODE = 'true'
      const qm = new QueryManager([], '', null)
      const sr = new SearchkitRequest(
        qm,
        {
          host: 'http://host-url',
          index: 'movies',
          hits: {
            fields: ['title']
          }
        },
        [],
        []
      )
      const x = await sr.search({
        aggs: { field: 'term' }
      })
      expect(window.console.log).toHaveBeenLastCalledWith(JSON.stringify({
        "size": 0,
        "aggs": {
          "field": "term"
        }
      }, null, 2))
    })
  })
})
