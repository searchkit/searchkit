import { RequestBody } from '@elastic/elasticsearch-types'
import { SearchkitConfig } from '..'
import { getHostFromCloud } from './utils'
import { SearchkitTransporter, SearchkitTransporterOverrides } from '.'

export default class FetchClientTransporter implements SearchkitTransporter {
  constructor(private config: SearchkitConfig) {}

  async performRequest(
    requestBody: RequestBody,
    overrides: SearchkitTransporterOverrides = {}
  ): Promise<any> {
    if (!fetch) throw new Error('Fetch is not supported in this browser / environment')

    if (!this.config.host && !this.config.cloud) {
      throw new Error('Host or cloud is required')
    }

    let host = this.config.host

    if (this.config.cloud) {
      host = getHostFromCloud(this.config.cloud)
    }

    const { index = this.config.index } = overrides
    const response = await fetch(host + '/' + index + '/_search', {
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
