import {State, ArrayState, ObjectState, ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {SearchkitManager} from "./SearchkitManager"

export class Searcher {
  accessors: Array<Accessor<any>>
  query: ImmutableQuery
  queryHasChanged: boolean
  results: any
  searchkitManager:SearchkitManager
  index:string
  loading:boolean
  private listeners = []
  constructor() {
    this.accessors = []
    this.query = new ImmutableQuery()
  }

  setSearchkitManager(searchkitManager){
    this.searchkitManager = searchkitManager
  }

  translate(key){
    return this.searchkitManager.translate(key)
  }

  addListener(fn){
    this.listeners.push(fn)
    return ()=>{
      this.listeners = _.without(this.listeners, fn)
    }
  }

  triggerListeners(){
    _.each(this.listeners, (fn)=> fn())
  }


  hasFilters(){
    return this.query && this.query.hasFilters()
  }

  hasFiltersOrQuery(){
    return this.query && this.query.hasFiltersOrQuery()
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
    if (this.queryHasChanged){
      this.loading = true
      this.triggerListeners()
    }
  }
  getCommandAndQuery(){
    return [
      // {index:this.getIndex()},
      this.query.getJSON()
    ]
  }
  getResults() {
    return this.results
  }
  setResults(results) {
    this.results = results
    this.loading = false
    _.each(this.accessors, (accessor)=> {
      accessor.setResultsState()
    })
    this.triggerListeners()
  }
}
