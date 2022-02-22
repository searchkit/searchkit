import { SearchkitConfig } from '..'
import { SearchkitAdapter } from '.'

export default class FetchClientAdapter implements SearchkitAdapter {
  constructor(private config: SearchkitConfig) {}

  async performRequest(requestBody) {
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
