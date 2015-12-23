import {
  Searcher
} from "./Searcher"

import * as _ from "lodash"

export class SearcherCollection {

  constructor(public searchers:Array<Searcher>) {

  }

  getQueries(){
    return _.map(this.searchers, (searcher)=> {
      return searcher.query.getJSON()
    })
  }

  setResponses(responses){
    _.each(responses, (results, index)=>{
      this.searchers[index].setResults(results)
    })
  }

  setError(error){
    _.invoke(this.searchers, "setError", error)
  }

}
