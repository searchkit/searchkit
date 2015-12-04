import {State, ArrayState, ObjectState, ValueState} from "./state/State"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {SearchkitManager} from "./SearchkitManager"

export class Searcher {
  accessors: Array<Accessor<any>>
  query: ImmutableQuery
  queryHasChanged: boolean
  results: any
  searchkitManager:SearchkitManager
  search_type:string
  constructor() {
    this.accessors = []
    this.search_type = "count"
    this.query = new ImmutableQuery()
  }

  setSearchkitManager(searchkitManager){
    this.searchkitManager = searchkitManager
  }

  hasFilters(){
    return this.query && this.query.hasFilters()
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
