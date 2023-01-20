import Searchkit from 'searchkit'
import type { SearchkitConfig, AppSettings, RequestOptions } from 'searchkit'

export * from 'searchkit'

class Client {
  searchkit: Searchkit

  constructor(private config: SearchkitConfig, private settings: AppSettings = { debug: false }) {
    this.searchkit = new Searchkit(config, settings)
  }

  async handleRequest(body: any, requestOptions?: RequestOptions) {
    return this.searchkit.handleInstantSearchRequests(body, requestOptions)
  }
}

const createClient = (config: SearchkitConfig, settings?: AppSettings) =>
  new Client(config, settings)

export default createClient
