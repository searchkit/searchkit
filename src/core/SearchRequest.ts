import {SearcherCollection} from "./SearcherCollection"
import {ESTransport} from "./ESTransport"

export class SearchRequest {

  active:boolean

  constructor(public transport, public searchers:SearcherCollection){
    this.active = true
  }

  run(){
    let queries = this.searchers.getQueries()
    if(queries.length > 0) {
      return this.transport.search(queries).then(
        this.setResponses.bind(this)
      ).catch(
        this.setError.bind(this)
      )
    }
    return Promise.resolve()
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
