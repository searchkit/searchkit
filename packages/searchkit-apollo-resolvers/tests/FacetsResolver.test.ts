import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { RefinementSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'

describe('Facets Resolver', () => {
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
        new RefinementSelectFacet({
          id: 'writers',
          field: 'writers.raw',
          label: 'Writers',
          display: 'override',
          multipleSelect: true
        }),
        new RefinementSelectFacet({ id: 'actors', field: 'actors.raw', label: 'Actors' }),
        new RefinementSelectFacet({ id: 'type', field: 'type.raw', label: 'Type' }),
        new RefinementSelectFacet({ id: 'genres', field: 'genres.raw', label: 'Genres' })
      ]
    }

    it('should return correct Results', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "") {
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              id
              type
              label
              display
              entries {
                id
                count
                label
              }
            }
          }
        }
      `

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })

    it('should return correct results with one filter', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(
            query: "",
            filters: [
              { id: "writers", value: "Damon Lindelof" },
              { id: "actors", value: "Damon Lindelof" },
            ]
            ) {
            hits(page: {size: 10, from: 0 }) {
              items {
                id
              }
            }
            facets {
              id
              type
              label
              display
              entries {
                id
                count
                label
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
