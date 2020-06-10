import { pollyContext } from '@spotify/polly-jest-presets'
import request from 'supertest'
import express from 'express'
import Server from './server'

let agent

global.pollyConfig = {
  logging: false
}

export const setupTestServer = (config) => {
  const app = express()
  const appServer = new Server(config)
  app.use(appServer.setupApolloServer())
  agent = request.agent(app)

  const { server } = pollyContext.polly

  server
    .any()
    .filter((req) => /^127.0.0.1:[0-9]+$/.test(req.headers.host as string))
    .passthrough()
}

export const callQuery = async ({ gql }) => {
  const response = await agent.post('/api/graphql').send({ query: gql })
  return response
}
