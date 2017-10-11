import axios, { AxiosInstance, AxiosResponse } from "axios"
import {ESTransport} from "./ESTransport"
const defaults = require("lodash/defaults")

export interface ESTransportOptions {
  headers?:Object,
  basicAuth?:string,
  withCredentials?:boolean,
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

    const credentials = AxiosESTransport.parseCredentials(this.options)
    const config = defaults(credentials, {
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

  private static parseCredentials(options: ESTransportOptions): any {
    let credentials = {}
    if (options.basicAuth !== undefined) {
       const parsed = options.basicAuth.split(":")
       const auth = { username: parsed[0], password: parsed[1] }
       credentials['auth'] = auth
    }
    if (options.withCredentials) {
       credentials['withCredentials'] = true
    }
    return credentials
  }
}
