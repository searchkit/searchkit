import {State, ArrayState, ObjectState, ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {SearchkitManager} from "./SearchkitManager"
import {EventEmitter} from "./support/EventEmitter";

export class Searcher {
  accessors: Array<Accessor>
  query: ImmutableQuery
  queryHasChanged: boolean
  results: any
  searchkitManager:SearchkitManager
  index:string
  loading:boolean
  error:any
  emitter:EventEmitter
  initialLoading:boolean

  constructor(searchkitManager) {
    this.searchkitManager = searchkitManager
    this.accessors = []
    this.query = new ImmutableQuery()
    this.emitter = new EventEmitter()
    this.initialLoading = true
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

  addAccessor(accessor: Accessor) {
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
    this.query = _.reduce(this.accessors, (query, accessor) => {
      return accessor.buildOwnQuery(query)
    }, query)
    this.beginNewSearch()
    return this.query
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
    _.invoke(this.accessors, "onNewResults")
    this.onResponseChange()
  }

  setError(error){
    this.clearQuery()
    this.error = error
    this.onResponseChange()
  }

  onResponseChange(){
    this.loading = false
    this.initialLoading = false
    this.emitter.trigger()
  }

}
