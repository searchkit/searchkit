export interface SearchkitTransporterOverrides {
  index?: string
}

export interface SearchkitTransporter {
  performRequest(requestBody, overrides?: SearchkitTransporterOverrides): Promise<any>
}
export { default as FetchClientTransporter } from './FetchClientTransporter'
