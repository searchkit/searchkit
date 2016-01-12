import {ImmutableQuery} from "../query/ImmutableQuery";
import {Searcher} from "../Searcher"
import {Utils} from "../support"

export class Accessor {
  searcher:Searcher
  uuid:string

  constructor(){
    this.uuid = Utils.guid()
  }

  setSearcher(searcher){
    this.searcher = searcher
  }

  translate(key){
    return this.searcher.translate(key)
  }

  getResults(){
    return this.searcher.results
  }

  onNewResults(){

  }

  getAggregations(path, defaultValue){
    const results = this.getResults()
    const getPath = ['aggregations',...path]
    return _.get(results, getPath, defaultValue)
  }

  buildSharedQuery(query:ImmutableQuery){
    return query
  }
  buildOwnQuery(query:ImmutableQuery){
    return query
  }
}
