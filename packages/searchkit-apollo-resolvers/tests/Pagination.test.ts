import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { setupTestServer, callQuery } from './support/helper'
import nock from 'nock'
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

      setupTestServer(config)

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          return [200, HitsMock]
        })

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
      expect(response.body.data.results.hits.items.length).toEqual(10)
      expect(response.status).toEqual(200)

      nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          return [200, HitsMock]
        })

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

      setupTestServer(config)

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          return [200, NoHitsES7Mock]
        })

      let response = await runQuery()
      expect(response.body.data.results.hits.page).toMatchInlineSnapshot(`
        Object {
          "from": 0,
          "pageNumber": 0,
          "size": 10,
          "total": 0,
          "totalPages": 0,
        }
      `)
      expect(response.body.data.results.hits.items.length).toEqual(0)
      expect(response.body.data.results.summary.total).toEqual(0)
      expect(response.status).toEqual(200)
    })

    it('No Results es6', async () => {

      setupTestServer(config)

      const scope = nock('http://localhost:9200')
        .post('/movies/_search')
        .reply((uri, body) => {
          return [200, NoHitsMock]
        })

      let response = await runQuery()
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
      expect(response.body.data.results.hits.items.length).toEqual(0)
      expect(response.status).toEqual(200)
    })
  })
})
