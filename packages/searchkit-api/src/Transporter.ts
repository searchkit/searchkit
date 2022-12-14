import { ClientConfigConnection, SearchRequest } from './types'
import { ElasticsearchResponseBody, Transporter } from './types'

export class ESTransporter implements Transporter {
  constructor(public config: ClientConfigConnection) {}

  async msearch(requests: SearchRequest[]): Promise<ElasticsearchResponseBody[]> {
    // @ts-ignore
    try {
      const response = await fetch(`${this.config.host}/_msearch`, {
        headers: {
          ...(this.config.apiKey ? { authorization: `ApiKey ${this.config.apiKey}` } : {}),
          'content-type': 'application/json'
        },
        body: requests
          .reduce<string[]>(
            (sum, request) => [
              ...sum,
              JSON.stringify({ index: request.indexName }),
              '\n',
              JSON.stringify(request.body),
              '\n'
            ],
            []
          )
          .join(''),
        method: 'POST'
      })

      const responses = await response.json()

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
      } else if (responses.status === 400) {
        throw new Error(
          'Elasticsearch Bad Request. Check your query and make sure it is valid. Turn on debug mode to see the Elasticsearch query.'
        )
      }
      return responses.responses
    } catch (error) {
      throw error
    }
  }
}
