import * as axios from "axios"

export class ESRequest {
  
  constructor(public index:string){
  }

  searchUrl(){
    return `/api/search/${this.index}`
  }

  search(query){
    return axios.post(this.searchUrl(), query)
      .then((response)=>{
        return response.data
      })
  }

}
