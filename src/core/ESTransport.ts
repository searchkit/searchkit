import * as axios from "axios"
import * as _ from "lodash"

export class ESTransport {
  static timeout = 5000
  axios:axios.AxiosInstance

  constructor(public host:string){
    this.axios = axios.create({
      baseURL:this.host,
      timeout:ESTransport.timeout,
      headers:{}
    })
  }

  search(query){
    return this.axios.post("_search", query)
      .then(this.getData)
  }

  msearch(queries){
    return this.axios.post("_msearch", queries)
      .then(this.getData)
  }

  getData(response){
    return response.data
  }

}
