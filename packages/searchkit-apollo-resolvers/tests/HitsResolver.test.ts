import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { setupTestServer, callQuery } from './support/helper'

describe('Hits Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (query = '', page = { size: 10, from: 0 }) => {
      const gql = `
        {
          results(query: "${query}") {
            hits(page: {size: ${page.size}, from: ${page.from} }) {
              items {
                id
                fields {
                  writers
                  actors
                }
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
        host: 'http://localhost:9200',
        index: 'movies',
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

    it('should return correct Results on page 2', async () => {
      const config: SearchkitConfig = {
        host: 'http://localhost:9200',
        index: 'movies',
        hits: {
          fields: ['actors', 'writers']
        },
        query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
      }

      setupTestServer(config)

      const response = await runQuery('', { size: 10, from: 10 })
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
