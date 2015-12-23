import {State, ArrayState, ObjectState, ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {SearchkitManager} from "./SearchkitManager"
import {EventEmitter} from "./support/EventEmitter";

export class Searcher {
  accessors: Array<Accessor<any>>
  query: ImmutableQuery
  queryHasChanged: boolean
  results: any
  searchkitManager:SearchkitManager
  index:string
  loading:boolean
  error:any
  emitter:EventEmitter

  constructor(searchkitManager) {
    this.searchkitManager = searchkitManager
    this.accessors = []
    this.query = new ImmutableQuery()
    this.emitter = new EventEmitter()
  }

  translate(key){
    return (
      this.searchkitManager && this.searchkitManager.translate(key)
      || key
    )
  }

  hasFiltersOrQuery(){
    return this.query && this.query.hasFiltersOrQuery()
  }

  addAccessor(accessor: Accessor<any>) {
    this.accessors.push(accessor)
    accessor.setSearcher(this)
  }

  clearQuery() {
    delete this.query
  }

  resetState(){
    _.invoke(this.accessors, "resetState")
  }

  buildQuery(query) {
    query = _.reduce(this.accessors, (query, accessor) => {
      return accessor.buildOwnQuery(query)
    }, query)
    this.queryHasChanged = ImmutableQuery.areQueriesDifferent(
      this.query, query)
    this.query = query
    if (this.queryHasChanged){
      this.beginNewSearch()
    }
    return query
  }

  beginNewSearch(){
    this.error = null
    this.loading = true
    this.emitter.trigger()
  }

  getResults() {
    return this.results
  }
  setResults(results) {
    this.results = results
    this.loading = false
    _.invoke(this.accessors, "setResultsState")
    this.emitter.trigger()
  }

  setError(error){
    this.clearQuery()
    this.error = error
    this.loading = false
    this.emitter.trigger()
  }

}
