import { SearchkitConfig } from '..'
import { SearchkitTransporter, SearchkitTransporterOverrides } from '.'

export default class FetchClientTransporter implements SearchkitTransporter {
  constructor(private config: SearchkitConfig) {}

  async performRequest(requestBody, overrides: SearchkitTransporterOverrides = {}): Promise<any> {
    if (!fetch) throw new Error('Fetch is not supported in this browser / environment')
    const { index = this.config.index } = overrides
    const response = await fetch(this.config.host + '/' + index + '/_search', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.connectionOptions?.headers || {}),
        ...(this.config.connectionOptions?.apiKey
          ? { Authorization: `ApiKey ${this.config.connectionOptions.apiKey}` }
          : {})
      }
    })
    const json = await response.json()
    return json
  }
}
