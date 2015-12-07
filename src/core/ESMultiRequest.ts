import * as axios from "axios"

export class ESMultiRequest {


  constructor(){

  }

  searchUrl(){
    return "/api/multisearch"
  }

  search(queries){
    return axios.post(this.searchUrl(), queries)
      .then((response)=>{
        return response.data
      })
  }

}
