import type { MultipleQueriesQuery } from 'searchkit'
import type Searchkit from 'searchkit'

interface InstantSearchElasticsearchAdapterConfig {
  url: string
  headers?: Record<string, string> | (() => Record<string, string>)
}

type Config = InstantSearchElasticsearchAdapterConfig | Searchkit

function isSearchkit(config: Config): config is Searchkit {
  return (config as Searchkit).handleInstantSearchRequests !== undefined
}

class InstantSearchElasticsearchAdapter {
  private cache: Record<string, any> = {}
  constructor(private config: Config) {}

  public clearCache(): Promise<void> {
    this.cache = {}
    return Promise.resolve(undefined)
  }

  private getHeaders(): Record<string, string> {
    let headers = {}
    if (!isSearchkit(this.config) && this.config.headers) {
      headers =
        typeof this.config.headers === 'function' ? this.config.headers() : this.config.headers
    }
    return headers
  }

  public async search(instantsearchRequests: Array<MultipleQueriesQuery>): Promise<unknown> {
    try {
      const key = JSON.stringify(instantsearchRequests)
      if (this.cache[key]) {
        return this.cache[key]
      }

      if (isSearchkit(this.config)) {
        const results = await this.config.handleInstantSearchRequests(instantsearchRequests)
        this.cache[key] = results
        return results
      }

      const response = await fetch(this.config.url, {
        body: JSON.stringify(instantsearchRequests),
        headers: {
          'Content-Type': 'application/json',
          ...this.getHeaders()
        },
        method: 'POST'
      })

      const results = await response.json()
      this.cache[key] = results
      return results
    } catch (e) {
      console.error(e)
      return []
    }
  }

  public async searchForFacetValues(
    instantsearchRequests: Array<MultipleQueriesQuery>
  ): Promise<any> {
    const isr = instantsearchRequests.map<MultipleQueriesQuery>((request) => {
      return {
        ...request,
        params: {
          ...request.params,
          hitsPerPage: 0
        }
      }
    })

    try {
      if (isSearchkit(this.config)) {
        const results = await this.config.handleInstantSearchRequests(isr)
        return results.results
      }

      const response = await fetch(this.config.url, {
        body: JSON.stringify(isr),
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

const createClient = (config: Config) => new InstantSearchElasticsearchAdapter(config)

export default createClient
