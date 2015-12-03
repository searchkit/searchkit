import {State, ArrayState, ObjectState, ValueState} from "./State.ts"
import {ImmutableQuery} from "./ImmutableQuery.ts";
import Accessor from "./accessors/Accessor.ts"
import SearchkitManager from "./SearchkitManager.ts"

export default class Searcher {
  accessors: Array<Accessor<any>>
  query: ImmutableQuery
  queryHasChanged: boolean
  results: any
  searchkitManager:SearchkitManager
  search_type:string
  constructor() {
    this.accessors = []
    this.search_type = "count"
  }

  setSearchkitManager(searchkitManager){
    this.searchkitManager = searchkitManager
  }

  addAccessor(accessor: Accessor<any>) {
    this.accessors.push(accessor)
    accessor.setSearcher(this)
  }
  buildQuery(query) {
    _.each(this.accessors, (accessor) => {
      query = accessor.buildOwnQuery(query)
    })
    this.queryHasChanged = ImmutableQuery.areQueriesDifferent(
      this.query, query)
    this.query = query
  }
  getCommandAndQuery(){
    return [
      {index:this.searchkitManager.index, search_type:this.search_type},
      this.query.getJSON()
    ]
  }
  getResults() {
    return this.results
  }
  setResults(results) {
    this.results = results
  }
}
