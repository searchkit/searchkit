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

    if(this.options.basicAuth){
      this.options.headers["Authorization"] = (
        "Basic " + btoa(this.options.basicAuth))
    }

    this.axios = axios.create({
      baseURL:this.host,
      timeout:this.options.timeout,
      headers:this.options.headers
    })

  }

  search(query:Object): Promise<AxiosResponse> {
    return this.axios.post(this.options.searchUrlPath, query)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

}
