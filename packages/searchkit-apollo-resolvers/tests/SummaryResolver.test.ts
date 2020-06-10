import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { MultipleSelectFacet, RefinementSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'

describe('Summary Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

    const config: SearchkitConfig = {
      host: 'http://localhost:9200/movies/_search',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [
        new MultipleSelectFacet({ id: 'writers', field: 'writers.raw', label: 'Writers' }),
        new RefinementSelectFacet({ id: 'actors', field: 'actors.raw', label: 'Actors' }),
        new RefinementSelectFacet({ id: 'type', field: 'type.raw', label: 'Type' }),
        new RefinementSelectFacet({ id: 'genres', field: 'genres.raw', label: 'Genres' })
      ]
    }

    it('should return correct summary', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "", filters: [{ id: "writers", selected:["Jeff Lindsay"]}]) {
            summary {
              total
              appliedFilters {
                id
                label
                value
              }
              query
            }
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
              page {
                total
                totalPages
                pageNumber
                from
                size
              }
            }
          }
        }
      `

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})
