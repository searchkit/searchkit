import { Client } from '@elastic/elasticsearch'
import HttpAgent, { HttpsAgent } from 'agentkeepalive'
import { SearchkitConfig } from '..'
import type { SearchkitTransporter } from '.'

const keepaliveHttpsAgent = new HttpsAgent()
const keepaliveAgent = new HttpAgent()

export default class ESClientTransporter implements SearchkitTransporter {
  private client: Client

  constructor(private config: SearchkitConfig) {
    if (!this.config.host && !this.config.cloud) {
      throw new Error('Host or cloud is required')
    }

    const esClientConfig: any = {
      ...(this.config.host ? { node: this.config.host } : { cloud: { id: this.config.cloud.id } }),
      auth: {
        apiKey: this.config.connectionOptions?.apiKey
      },
      headers: {
        ...(this.config.connectionOptions?.headers || {})
      }
    }

    if (this.config.host) {
      esClientConfig.agent = () =>
        new URL(this.config.host).protocol === 'http:' ? keepaliveAgent : keepaliveHttpsAgent
    }

    this.client = new Client(esClientConfig)
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
