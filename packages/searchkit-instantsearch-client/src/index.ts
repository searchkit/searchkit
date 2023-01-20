interface InstantSearchElasticsearchAdapterConfig {
  url: string
  headers?: Record<string, string> | (() => Record<string, string>)
}

class InstantSearchElasticsearchAdapter {
  constructor(private config: InstantSearchElasticsearchAdapterConfig) {}

  public async clearCache(): Promise<void> {
    return
  }

  private getHeaders(): Record<string, string> {
    let headers = {}
    if (this.config.headers) {
      headers =
        typeof this.config.headers === 'function' ? this.config.headers() : this.config.headers
    }
    return headers
  }

  public async search(instantsearchRequests: ReadonlyArray<any>): Promise<unknown> {
    try {
      const response = await fetch(this.config.url, {
        body: JSON.stringify(instantsearchRequests),
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders()
        },
        method: 'POST'
      })

      const results = await response.json()
      return results
    } catch (e) {
      console.error(e)
      return []
    }
  }

  public async searchForFacetValues(instantsearchRequests: ReadonlyArray<any>): Promise<any> {
    try {
      const response = await fetch(this.config.url, {
        body: JSON.stringify(instantsearchRequests),
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders()
        },
        method: 'POST'
      })

      const results = await response.json()
      return results.results
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

const createClient = (config: InstantSearchElasticsearchAdapterConfig) =>
  new InstantSearchElasticsearchAdapter(config)

export default createClient
