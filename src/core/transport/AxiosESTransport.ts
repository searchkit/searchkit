import * as axios from "axios"
import {ImmutableQuery} from "../query"
import {ESTransport, ESTransportOptions} from "./ESTransport";
const defaults = require("lodash/defaults")

export class AxiosESTransport extends ESTransport{
  static timeout = 5000
  axios:axios.AxiosInstance
  options:ESTransportOptions

  constructor(public host:string, options:ESTransportOptions={}){
    super()
    this.options = defaults(options, {
      headers:{},
      withCredentials: false,
      searchUrlPath:"/_search"
    })
    if(this.options.basicAuth){
      this.options.headers["Authorization"] = (
        "Basic " + btoa(this.options.basicAuth))
    }
    this.axios = axios.create({
      baseURL:this.host,
      timeout:AxiosESTransport.timeout,
      headers:this.options.headers,
      withCredentials: this.options.withCredentials
    })
  }

  search(query:Object){
    return this.axios.post(this.options.searchUrlPath, query)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

}
