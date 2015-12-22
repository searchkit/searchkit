import {State} from "../state"
import {ImmutableQuery} from "../query/ImmutableQuery";
import {Searcher} from "../Searcher"

export class Accessor<T extends State<any>> {
  key:string
  urlKey:string
  state:T
  resultsState:T
  searcher:Searcher
  constructor(key, urlString?){
    this.key = key
    this.urlKey = urlString || key && key.replace(/\./g, "_")
  }

  setSearcher(searcher){
    this.searcher = searcher
    this.setResultsState()
  }

  translate(key){
    return this.searcher.translate(key)
  }

  onStateChange(oldState){

  }

  fromQueryObject(ob){
    let value = ob[this.urlKey]
    this.state = this.state.setValue(value)
  }

  getQueryObject(){
    return {
      [this.urlKey]:this.state.getValue()
    }
  }

  getResults(){
    return this.searcher.results
  }

  setResultsState(){
    this.resultsState = this.state
  }

  resetState(){
    this.state = this.state.clear()
  }

  buildSharedQuery(query:ImmutableQuery){
    return query
  }
  buildOwnQuery(query:ImmutableQuery){
    return query
  }
}
