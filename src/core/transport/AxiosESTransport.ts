import * as axios from "axios"
import {ImmutableQuery} from "../query"
import {ESTransport} from "./ESTransport";
const defaults = require("lodash/defaults")

export interface ESTransportOptions {
  headers?:Object,
  basicAuth?:string
}

export class AxiosESTransport extends ESTransport{
  static timeout = 5000
  axios:axios.AxiosInstance
  options:ESTransportOptions

  constructor(public host:string, options:ESTransportOptions={}){
    super()
    this.options = defaults(options, {
      headers:{}
    })
    if(this.options.basicAuth){
      this.options.headers["Authorization"] = (
        "Basic " + btoa(this.options.basicAuth))
    }
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers
    })
  }

  search(query:Object){
    return this.axios.post("/_search", query)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

}
