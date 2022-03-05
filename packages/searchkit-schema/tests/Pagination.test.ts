import nock from 'nock'
import { SearchkitConfig } from '@searchkit/sdk'
import { MultiMatchQuery } from '@searchkit/sdk'
import { setupTestServer, callQuery } from './support/helper'
import HitsMock from './__mock-data__/HitResolver/Hits.json'
import NoHitsES7Mock from './__mock-data__/HitResolver/NoHitsES7.json'
import NoHitsMock from './__mock-data__/HitResolver/NoHits.json'

describe('Pagination', () => {
  describe('should return as expected', () => {
    const config: SearchkitConfig = {
      host: 'http://localhost:9200',
      index: 'movies',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] })
    }

    const runQuery = async (page = { size: 10, from: 0 }) => {
      const gql = `
      query {
        results {
          summary {
            total
          }
          hits(page: {from: ${page.from}, size: ${page.size} }) {
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
      const response = await callQuery({ gql })
      return response
    }

    it('Pagination results', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => [200, HitsMock])

      let response = await runQuery()
      expect(response.body.data.results.hits.page).toMatchInlineSnapshot(`
        Object {
          "from": 0,
          "pageNumber": 0,
          "size": 10,
          "total": 4162,
          "totalPages": 417,
        }
      `)
      expect(response.body.data.results.hits.items).toHaveLength(10)
      expect(response.status).toEqual(200)

      nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => [200, HitsMock])

      response = await runQuery({ from: 20, size: 10 })
      expect(response.body.data.results.hits.page).toMatchInlineSnapshot(`
        Object {
          "from": 20,
          "pageNumber": 2,
          "size": 10,
          "total": 4162,
          "totalPages": 417,
        }
      `)
      expect(response.status).toEqual(200)
    })

    it('No Results es7', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => [200, NoHitsES7Mock])

      const response = await runQuery()
      expect(response.body.data.results.hits.page).toMatchInlineSnapshot(`
        Object {
          "from": 0,
          "pageNumber": 0,
          "size": 10,
          "total": 0,
          "totalPages": 0,
        }
      `)
      expect(response.body.data.results.hits.items).toHaveLength(0)
      expect(response.body.data.results.summary.total).toEqual(0)
      expect(response.status).toEqual(200)
    })

    it('No Results es6', async () => {
      setupTestServer({
        config,
        addToQueryType: true,
        typeName: 'ResultSet',
        hitTypeName: 'ResultHit'
      })

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => [200, NoHitsMock])

      const response = await runQuery()
      expect(response.body.data.results.hits.page).toMatchInlineSnapshot(`
        Object {
          "from": 0,
          "pageNumber": 0,
          "size": 10,
          "total": 0,
          "totalPages": 0,
        }
      `)
      expect(response.body.data.results.summary.total).toEqual(0)
      expect(response.body.data.results.hits.items).toHaveLength(0)
      expect(response.status).toEqual(200)
    })
  })
})
