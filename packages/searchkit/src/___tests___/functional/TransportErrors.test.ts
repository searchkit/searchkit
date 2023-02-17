import Client from '../../'
import { DisjunctiveExampleRequest } from '../mocks/AlgoliaRequests'
import type { AlgoliaMultipleQueriesQuery } from '@searchkit/api'
import { ESTransporter } from '../../'

import nock from 'nock'
import {
  APIKeyNotAuthorized,
  ElasticsearchError,
  InvalidRequest,
  KeyUnauthorizedForIndex
} from '../mocks/ErrorElasticsearchResponses'

describe('Transport Errors', () => {
  let consoleError: jest.SpyInstance
  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  const transporter = new ESTransporter(
    {
      host: 'http://localhost:9200',
      apiKey: 'apikey'
    },
    { debug: false }
  )

  it('401 error', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, APIKeyNotAuthorized)

    await expect(() => {
      return transporter.msearch([])
    }).rejects.toThrowErrorMatchingSnapshot()
    expect(consoleError).toBeCalled()
  })

  it('403 error', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, KeyUnauthorizedForIndex)

    await expect(() => {
      return transporter.msearch([])
    }).rejects.toThrowErrorMatchingSnapshot()
    expect(consoleError).toBeCalled()
  })

  it('400 error', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, InvalidRequest)

    await expect(() => {
      return transporter.msearch([])
    }).rejects.toThrowErrorMatchingSnapshot()
    expect(consoleError).toBeCalled()
  })

  it('500 error', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, ElasticsearchError)

    await expect(() => {
      return transporter.msearch([])
    }).rejects.toThrowErrorMatchingSnapshot()
    expect(consoleError).toBeCalled()
  })

  const client = new Client({
    connection: {
      host: 'http://localhost:9200',
      apiKey: 'apikey'
    },
    search_settings: {
      highlight_attributes: ['title', 'actors'],
      search_attributes: ['title', 'actors', 'query'],
      result_attributes: ['title', 'actors', 'query'],
      facet_attributes: ['type'],
      query_rules: []
    }
  })

  it('401 error', async () => {
    nock('http://localhost:9200')
      .post('/_msearch', (requestBody: any) => {
        return true
      })
      .reply(200, APIKeyNotAuthorized)

    const x = await client.handleInstantSearchRequests(
      DisjunctiveExampleRequest as AlgoliaMultipleQueriesQuery[]
    )
    expect(x).toEqual({ results: [] })
    expect(consoleError).toBeCalled()
  })
})
