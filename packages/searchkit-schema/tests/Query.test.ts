import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { CustomQuery } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'

describe('Query Options', () => {
  describe('should return as expected', () => {
    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      sortOptions: [{ field: 'relevance', id: 'relevance', label: 'Relevance' }],
      query: new CustomQuery({
        queryFn: (query, queryManager) => {
          expect(queryManager.getQueryOptions().fields).toEqual(['customField'])
          expect(queryManager.getSortBy()).toEqual({
            id: 'relevance',
            field: 'relevance',
            label: 'Relevance'
          })
          const field = queryManager.getQueryOptions().fields[0]
          return {
            bool: {
              must: [
                {
                  wildcard: {
                    [field]: {
                      value: query + '*',
                      boost: 1.0,
                      rewrite: 'constant_score'
                    }
                  }
                }
              ]
            }
          }
        }
      })
    }

    const runQuery = async (page = { size: 10, from: 0 }) => {
      const gql = `
      query {
        results(query: "tes", queryOptions: { fields: ["customField"] }) {
          hits(sortBy: "relevance") {
            items {
              id
            }
          }
        }
      }
      `
      const response = await callQuery({ gql })
      return response
    }

    it('Custom Query Options', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body: any) => {
          expect(body.query.bool.must[0].wildcard.customField).toBeDefined()
          return [200, HitsMock]
        })

      const response = await runQuery()
      expect(response.body.data.results.hits.items).toHaveLength(10)
    })
  })
})
