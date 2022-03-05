import { Client } from '@elastic/elasticsearch'
import HttpAgent, { HttpsAgent } from 'agentkeepalive'
import { SearchkitConfig } from '..'
import type { SearchkitTransporter } from '.'

const keepaliveHttpsAgent = new HttpsAgent()
const keepaliveAgent = new HttpAgent()

export default class ESClientTransporter implements SearchkitTransporter {
  private client: Client

  constructor(private config: SearchkitConfig) {
    this.client = new Client({
      node: this.config.host,
      auth: {
        apiKey: this.config.connectionOptions?.apiKey
      },
      headers: {
        ...(this.config.connectionOptions?.headers || {})
      },
      agent: () =>
        new URL(this.config.host).protocol === 'http:' ? keepaliveAgent : keepaliveHttpsAgent
    })
  }

  async performRequest(requestBody) {
    const debugMode = process.env.DEBUG_MODE === 'true'
    try {
      if (debugMode) console.log(JSON.stringify(requestBody, null, 2))
      const response = await this.client.search<any>({
        index: this.config.index,
        body: requestBody
      })
      return response.body
    } catch (e) {
      if (debugMode) console.log(JSON.stringify(e, null, 2))
      if (e.meta?.statusCode === 400) {
        if (debugMode) {
          console.log(
            `Elasticsearch query failed. Check your custom filters or configuration. Above is the ES Query`
          )
        }
        throw e
      } else {
        throw e
      }
    }
  }
}
