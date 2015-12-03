import {State,ArrayState,ObjectState,ValueState} from "./State.ts"
import {ImmutableQuery} from "./ImmutableQuery.ts";
import Accessor from "./accessors/Accessor.ts"

export default class Searcher {
  accessors:Array<Accessor<any>>
  query:ImmutableQuery
  queryHasChanged:boolean
  results:any

  constructor(){
    this.accessors = []
  }
  addAccessor(accessor:Accessor<any>){
    this.accessors.push(accessor)
    accessor.setSearcher(this)
  }
  buildQuery(query){
    _.each(this.accessors, (accessor)=>{
      query = accessor.buildOwnQuery(query)
    })
    this.queryHasChanged = ImmutableQuery.areQueriesDifferent(
      this.query, query)
    this.query = query
  }
  getResults(){
    return this.results
  }
  setResults(results) {
    this.results = results
  }
}
