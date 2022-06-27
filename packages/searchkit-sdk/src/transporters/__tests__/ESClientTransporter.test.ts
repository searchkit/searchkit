import nock from 'nock'
;(global as any).setImmediate = jest.useRealTimers
import ESClientTransporter from '../ESClientTransporter'

describe('ESClientTransporter', () => {
  it('perform a request', () => {
    const transporter = new ESClientTransporter({
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

  it('perform a request with cloudId', () => {
    const transporter = new ESClientTransporter({
      cloud: {
        id: 'commerce-demo:dXMtZWFzdDQuZ2NwLmVsYXN0aWMtY2xvdWQuY29tOjQ0MyRkMWJkMzY4NjJjZTU0YzdiOTAzZTJhYWNkNGNkN2YwYSQ2ZDRiY2YwOWI2ZWU0NjBjOWVlNTg4YjJiNWM5ZGE0MQ=='
      },
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

    const scope = nock('https://d1bd36862ce54c7b903e2aacd4cd7f0a.us-east4.gcp.elastic-cloud.com', {
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
