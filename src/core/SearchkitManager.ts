
import {State,ArrayState,ObjectState,ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {Searcher} from "./Searcher"
import {history} from "./history";
import {ESTransport} from "./ESTransport";
import * as _ from "lodash"

require('es6-promise').polyfill()

export interface SearchkitOptions {
  searchMode?:string  
}

export class SearchkitManager {
  searchers:Array<Searcher>
  host:string
  private registrationCompleted:Promise<any>
  completeRegistration:Function
  state:any
  translateFunction:Function
  defaultQueries:Array<Function>
  transport:ESTransport
  performSearch:Function
  searchMode:string
  primarySearcher:Searcher
  constructor(host:string, options:SearchkitOptions = {}){
    this.host = host
    this.searchers = []
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
    this.listenToHistory(history)
    this.defaultQueries = []
    this.translateFunction = _.identity
    this.transport = new ESTransport(this.host)
    this.performSearch = _.throttle(
      this._performSearch.bind(this),
      100,
      {trailing:true}
    )
    this.searchMode = options.searchMode || "single"
    if(this.searchMode == "single"){
      this.primarySearcher = this.createSearcher()
    }    
  }
  addSearcher(searcher){
    this.searchers.push(searcher)
    searcher.setSearchkitManager(this)
  }

  addDefaultQuery(fn:Function){
    this.defaultQueries.push(fn)
  }
  translate(key){
    return this.translateFunction(key)
  }

  createSearcher(){
    var searcher = new Searcher()
    this.addSearcher(searcher)
    return searcher
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

  resetState(){

    this.iterateAccessors((accessor)=>{
      accessor.resetState()
    })
  }

  getState(){
    var state = {}
    this.iterateAccessors((accessor)=>{
      var val = accessor.state.getValue()
      if(val){
        state[accessor.urlKey] = val
      }
    })
    return state
  }

  hasState(){
    return !_.isEmpty(this.getState())
  }

  buildSharedQuery(){
    var query = new ImmutableQuery()
    query = _.reduce(this.defaultQueries, (currentQuery, fn)=>{
      return fn(currentQuery)
    }, query)
    this.iterateAccessors((accessor)=>{
      query = accessor.buildSharedQuery(query)
    })
    return query
  }

  clearSearcherQueries(){
    _.each(this.searchers, (searcher)=>{
      searcher.clearQuery()
    })
  }

  makeQueryDef(){
    var queryDef = {
      queries:[],
      searchers:[]
    }
    var query = this.buildSharedQuery()
    _.each(this.searchers, (searcher)=>{
      searcher.buildQuery(query)
      if(searcher.queryHasChanged){
        queryDef.queries = queryDef.queries.concat(
          searcher.getCommandAndQuery()
        )
        queryDef.searchers.push(searcher)
      }
    })
    return queryDef
  }

  listenToHistory(history){
    history.listen((location)=>{
      //action is POP when the browser modified
      if(location.action === "POP") {
        this.registrationCompleted.then(()=>{
          this.setAccessorStates(location.query)
          this._search()
        })
      }
    })
  }

  setAccessorStates(query){
    this.iterateAccessors((accessor)=>{
      var value = query[accessor.urlKey]
      accessor.state = accessor.state.setValue(value)
    })
  }

  notifyStateChange(oldState){
    this.iterateAccessors((accessor)=>{
      accessor.onStateChange(oldState)
    })
  }

  _performSearch(){
    this.notifyStateChange(this.state)
    this._search()
    history.pushState(null, window.location.pathname, this.state)
  }
  search(){
    this.performSearch()
  }
  
  //TODO: refactor single, multiple 
  _search(){
    this.state = this.getState()
    var queryDef = this.makeQueryDef()
    console.log("multiqueries", queryDef.queries)    
    if(queryDef.queries.length > 0) {
      if(this.searchMode === "single"){
        this.transport.search(queryDef.queries[0]).then((response)=> {
          queryDef.searchers[0].setResults(response)
        }).catch((error)=> {
          this.clearSearcherQueries()
          _.each(queryDef.searchers, (searcher)=> {
            searcher.setError(error)
          })
        })
      } else if (this.searchMode === "multiple") {
        this.transport.msearch(queryDef.queries).then((response)=> {
          _.each(response["responses"], (results, index)=>{
            queryDef.searchers[index].setResults(results)
          })
        }).catch((error)=> {
          this.clearSearcherQueries()
          _.each(queryDef.searchers, (searcher)=> {
            searcher.setError(error)
          })
        })  
      }            
    }
  }

}
