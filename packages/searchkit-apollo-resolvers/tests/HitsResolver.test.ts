import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { setupTestServer, callQuery } from './support/helper'
import { MultiMatchQuery } from '../src'

describe('Hits Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (query = '') => {
      const gql = `
        {
          results(query: "${query}") {
            hits(page: {rows: 10, start: 0 }) {
              id
              fields {
                writers
                actors
              }
            }
          }
        }
      `
      const response = await callQuery({ gql })
      return response
    }

    it('should return correct Results', async () => {
      const config: SearchkitConfig = {
        host: 'http://localhost:9200/movies/_search',
        hits: {
          fields: ['actors', 'writers']
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer(config)

      const response = await runQuery()
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
