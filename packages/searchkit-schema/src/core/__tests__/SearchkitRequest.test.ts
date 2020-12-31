import { Client } from '@elastic/elasticsearch'
import SearchkitRequest from '../SearchkitRequest'
import QueryManager from '../QueryManager'

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn(() => ({
    search: jest.fn(() => Promise.resolve('ES'))
  }))
}))

describe('SearchkitRequest', () => {
  it('should', async () => {
    const qm = new QueryManager([], '')
    const sr = new SearchkitRequest(qm, {
      host: 'http://host-url',
      index: 'movies',
      hits: {
        fields: ['title']
      }
    })
    const x = await sr.search({
      aggs: { field: 'term' }
    })
    expect(Client).toHaveBeenCalledTimes(1)
  })
})
