import { SearchkitConfig } from '..'
import { SearchkitTransporter } from '.'

export default class FetchClientTransporter implements SearchkitTransporter {
  constructor(private config: SearchkitConfig) {}

  async performRequest(requestBody) {
    if (!fetch) throw new Error('Fetch is not supported in this browser / environment')
    const response = await fetch(this.config.host + '/' + this.config.index + '/_search', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()
    return json
  }
}
