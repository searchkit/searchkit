import { SearchkitConfig } from '..'

export interface SearchkitAdapterConstructor {
  new (config: SearchkitConfig): SearchkitAdapter
}

export interface SearchkitAdapter {
  performRequest(requestBody): Promise<any>
}
