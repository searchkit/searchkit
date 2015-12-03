import {State,ArrayState,ObjectState,ValueState} from "./State.ts"
import {ImmutableQuery} from "./ImmutableQuery.ts";
import Accessor from "./accessors/Accessor.ts"
import Searcher from "./Searcher.ts"

export default class SearchkitManager {
  searchers:Array<Searcher>
  constructor(){
    this.searchers = []
  }
  addSearcher(searcher){
    this.searchers.push(searcher)
  }
  getAccessors(){
    return _.chain(this.searchers)
      .pluck("accessors")
      .flatten()
      .value()
  }

  iterateAccessors(fn){
    var accessors = this.getAccessors()
    _.each(accessors, fn)

  }

  getState(){
    var state = {}
    this.iterateAccessors((accessor)=>{
      state[accessor.key] = accessor.state.getValue()
    })
    return state
  }

  buildSharedQuery(){
    var query = new ImmutableQuery()
    this.iterateAccessors((accessor)=>{
      query = accessor.buildSharedQuery(query)
    })
    return query
  }
  search(){
    var query = this.buildSharedQuery()
    var queries = []
    _.each(this.searchers, (searcher)=>{
      searcher.buildQuery(query)
      if(searcher.queryHasChanged){
        queries.push(searcher.query.getJSON())
      }
    })
    return queries
  }

}
