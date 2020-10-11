import path from 'path'
import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import { setupPolly } from 'setup-polly-jest'
import express from 'express'
import request from 'supertest'
import Server from './server'

let agent

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

function getDefaultRecordingDir() {
  const testPath: string = (global as any).jasmine.testPath
  return path.relative(process.cwd(), `${path.dirname(testPath)}/__recordings__`)
}

const mode = process.env.POLLY_MODE || 'replay'

const defaultConfig = {
  adapters: ['node-http'],
  persister: 'fs',
  persisterOptions: {
    keepUnusedRequests: false,
    fs: {
      recordingsDir: getDefaultRecordingDir()
    }
  },
  mode,
  recordIfMissing: false,
  recordFailedRequests: true,
  expiryStrategy: 'warn',
  expiresIn: '14d',
  // insulate the tests from differences in session data. we use order and
  // url to match requests to one another, which we did previously with an
  // internal fork of LinkedIn's Sepia VCR. This should be fine for deterministic
  // requests, and you can circumvent non-deterministic stuff by manipulating
  // things in the Polly Server: https://netflix.github.io/pollyjs/#/server/overview?id=overview
  matchRequestsBy: {
    headers: false,
    body: false
  }
}

const context = setupPolly(defaultConfig)

beforeEach(() => {
  context.polly.server
    .any()
    .filter((req) => /^127.0.0.1:[0-9]+$/.test(req.headers.host as string))
    .passthrough()

  context.polly.server.any().on('request', (req) => {
    if (req.url === 'http://localhost:9200/') {
      req.url = req.url + 'movies/_search'
    }
  })
})

export const setupTestServer = (config) => {
  const app = express()
  const appServer = new Server(config)
  app.use(appServer.setupApolloServer())
  agent = request.agent(app)
}

export const callQuery = async ({ gql }) => {
  const response = await agent.post('/api/graphql').send({ query: gql })
  return response
}
