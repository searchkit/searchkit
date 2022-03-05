import nock from 'nock'
import FetchClientTransporter from '../FetchClientTransporter'

describe('FetchClientTransporter', () => {
  it('perform a request', () => {
    const transporter = new FetchClientTransporter({
      host: 'http://localhost:9200',
      index: 'my_index',
      connectionOptions: {
        apiKey: 'blah',
        headers: {
          'X-Custom-Header': 'blah'
        }
      },
      hits: {
        fields: []
      }
    })

    const body = {
      query: {
        match_all: {}
      }
    }

    const scope = nock('http://localhost:9200', {
      reqheaders: {
        'authorization': 'ApiKey blah',
        'X-Custom-Header': 'blah'
      }
    })
      .post('/my_index/_search')
      .reply(200, () => ({
        hits: {
          hits: [
            {
              _id: '1',
              _source: {
                title: 'My title'
              }
            }
          ]
        }
      }))

    return transporter
      .performRequest({
        body
      })
      .then((response) => {
        expect(response.hits.hits).toHaveLength(1)
        expect(response.hits.hits[0]._id).toEqual('1')
        expect(response.hits.hits[0]._source.title).toEqual('My title')
      })
  })
})
