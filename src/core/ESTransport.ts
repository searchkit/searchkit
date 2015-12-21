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

  _search(query){
    return this.axios.post("_search", query)
      .then(this.getData)
  }

  _msearch(queries){
    return this.axios.post("_msearch", queries)
      .then(this.getData)
      .then(response => response["responses"])
  }

  search(queries){
    if(queries.length === 1){
      return this._search(queries[0])
        .then(response=>[response])
    } else {
      return this._msearch(queries)
    }

  }



  getData(response){
    return response.data
  }

}
