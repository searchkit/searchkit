import Searchkit from 'searchkit'
import type { SearchkitConfig, AppSettings, RequestOptions } from 'searchkit'

export * from 'searchkit'

class Client {
  searchkit: Searchkit

  constructor(private config: SearchkitConfig, private settings: AppSettings = { debug: false }) {
    this.searchkit = new Searchkit(config, settings)
  }

  // Explicit return type: searchkit's declarations inline the Elasticsearch types they use, so
  // the inferred type would reference names this package's declarations cannot import.
  handleRequest(
    body: any,
    requestOptions?: RequestOptions
  ): ReturnType<Searchkit['handleInstantSearchRequests']> {
    return this.searchkit.handleInstantSearchRequests(body, requestOptions)
  }
}

const createClient = (config: SearchkitConfig, settings?: AppSettings) =>
  new Client(config, settings)

export default createClient
