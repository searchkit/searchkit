import {SearcherCollection} from "./SearcherCollection"
import {ESTransport} from "./ESTransport"

export class SearchRequest {

  active:boolean
  transport:ESTransport

  constructor(public host:string, public searchers:SearcherCollection){
    this.active = true
    this.transport = new ESTransport(host)
  }

  run(){
    let queries = this.searchers.getQueries()
    console.log("queries", queries)
    if(queries.length > 0) {
      this.transport.search(queries).then(
        this.setResponses.bind(this)
      ).catch(
        this.setError.bind(this)
      )
    }
  }

  deactivate(){
    this.active = false
  }

  setResponses(responses){
    if(this.active){
      this.searchers.setResponses(responses)
    }
  }
  setError(error){
    if(this.active){
      this.searchers.setError(error)
    }
  }


}
