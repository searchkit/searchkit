import * as axios from "axios"

export default class ESRequest {


  constructor(public index:string){

  }

  searchUrl(){
    return "/api/multisearch/"+this.index
  }

  search(queries){
    return axios.post(this.searchUrl(), queries)
      .then((response)=>{
        return response.data
      })
  }

}
