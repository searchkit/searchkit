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
  it('should', async () => {
    const qm = new QueryManager([], '')
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
      const qm = new QueryManager([], '')
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
    })
  })
})
