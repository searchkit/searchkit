import axios, { AxiosInstance, Promise, AxiosResponse } from "axios"
import {ImmutableQuery} from "../query"
import {ESTransport} from "./ESTransport"
import {defaults} from "lodash"

export interface ESTransportOptions {
  headers?:Object,
  basicAuth?:string,
  searchUrlPath?:string,
  timeout?: number
}

export class AxiosESTransport extends ESTransport{
  static timeout: number = 5000
  axios: AxiosInstance
  options: ESTransportOptions

  constructor(public host:string, options:ESTransportOptions={}){
    super()
    this.options = defaults(options, {
      headers:{},
      searchUrlPath:"/_search",
      timeout: AxiosESTransport.timeout
    })

    const auth = this.options.basicAuth ? AxiosESTransport.parseAuth(this.options.basicAuth) : {}
    const config = defaults(auth, {
      baseURL:this.host,
      timeout:this.options.timeout,
      headers:this.options.headers
    })
    this.axios = axios.create(config)
  }

  search(query:Object): Promise<AxiosResponse> {
    return this.axios.post(this.options.searchUrlPath, query)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

  private static parseAuth(basicAuth: string): any {
    const credentials = basicAuth.split(":")
    return { username: credentials[0], password: credentials[1] }
  }
}
