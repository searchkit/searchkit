import { AppSettings, ConfigConnection, SearchRequest } from './types'
import { ElasticsearchResponseBody, Transporter } from './types'
import { createElasticsearchQueryFromRequest } from './utils'

export class ESTransporter implements Transporter {
  constructor(public config: ConfigConnection, private settings: AppSettings) {}

  async performNetworkRequest(requests: SearchRequest[]) {
    return fetch(`${this.config.host}/_msearch`, {
      headers: {
        ...(this.config.apiKey ? { authorization: `ApiKey ${this.config.apiKey}` } : {}),
        'content-type': 'application/json',
        ...(this.config.headers || {})
      },
      body: createElasticsearchQueryFromRequest(requests),
      method: 'POST'
    })
  }

  async msearch(requests: SearchRequest[]): Promise<ElasticsearchResponseBody[]> {
    try {
      const response = await this.performNetworkRequest(requests)
      const responses = await response.json()

      if (this.settings.debug) {
        console.log('Elasticsearch response:')
        console.log(responses)
      }

      if (responses.status >= 500) {
        throw new Error(
          'Elasticsearch Internal Error: Check your elasticsearch instance to make sure it can recieve requests.'
        )
      } else if (responses.status === 401) {
        throw new Error(
          'Cannot connect to Elasticsearch. Check your connection host and API Key. You can also provide a custom Elasticsearch transporter to the API Client. See docs for more information.'
        )
      } else if (responses.responses?.[0]?.status === 403) {
        throw new Error(
          'Auth Error: You do not have permission to access this index. Check you are calling the right index (specified in frontend) and your API Key permissions has access to the index.'
        )
      } else if (responses.status === 404 || responses.responses?.[0]?.status === 404) {
        throw new Error(
          'Elasticsearch index not found. Check your index name and make sure it exists.'
        )
      } else if (responses.status === 400 || responses.responses?.[0]?.status === 400) {
        throw new Error(
          `Elasticsearch Bad Request. 
          
          1. Check your query and make sure it is valid. 
          2. Check the field mapping. See documentation to make sure you are using text types for searching and keyword fields for faceting
          3. Turn on debug mode to see the Elasticsearch query and the error response.
          `
        )
      }
      return responses.responses
    } catch (error) {
      throw error
    }
  }
}
