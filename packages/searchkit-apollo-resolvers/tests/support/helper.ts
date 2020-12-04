import express from 'express'
import request from 'supertest'
import Server from './server'

let agent

export const setupTestServer = (config) => {
  const app = express()
  const appServer = new Server(config)
  app.use(appServer.setupApolloServer())
  agent = request(app)
}

export const callQuery = async ({ gql }) => {
  const response = await agent.post('/api/graphql').send({ query: gql })
  return response
}
