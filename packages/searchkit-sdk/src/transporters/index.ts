export interface SearchkitTransporter {
  performRequest(requestBody): Promise<any>
}
export { default as FetchClientTransporter } from './FetchClientTransporter'
