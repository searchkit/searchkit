
import {State,ArrayState,ObjectState,ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {Searcher} from "./Searcher"
import {history} from "./history";
import {ESTransport} from "./ESTransport";
import {SearcherCollection} from "./SearcherCollection"
import {SearchRequest} from "./SearchRequest"
import {Utils} from "./support"
import * as _ from "lodash"

require('es6-promise').polyfill()

export interface SearchkitOptions {
  multipleSearchers?:boolean
}

export class SearchkitManager {
  searchers:SearcherCollection
  host:string
  private registrationCompleted:Promise<any>
  completeRegistration:Function
  state:any
  translateFunction:Function
  defaultQueries:Array<Function>
  multipleSearchers:boolean
  primarySearcher:Searcher
  currentSearchRequest:SearchRequest

  constructor(host:string, options:SearchkitOptions = {}){
    this.host = host
    this.searchers = new SearcherCollection()
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
    this.listenToHistory(history)
    this.defaultQueries = []
    this.translateFunction = _.identity
    this.multipleSearchers = options.multipleSearchers || false
    this.primarySearcher = this.createSearcher()
  }
  addSearcher(searcher){
    return this.searchers.add(searcher)
  }

  addDefaultQuery(fn:Function){
    this.defaultQueries.push(fn)
  }
  translate(key){
    return this.translateFunction(key)
  }

  createSearcher(){
    return this.addSearcher(new Searcher(this))
  }
  buildSharedQuery(){
    var sharedQuery = Utils.collapse(
      this.defaultQueries, new ImmutableQuery())
    return this.searchers.buildSharedQuery(sharedQuery)
  }

  buildQuery(){
    let sharedQuery = this.buildSharedQuery()
    this.searchers.buildQuery(sharedQuery)
  }

  resetState(){
    this.searchers.resetState()
  }

  listenToHistory(history){
    history.listen((location)=>{
      //action is POP when the browser modified
      if(location.action === "POP") {
        this.registrationCompleted.then(()=>{
          this.searchers.setAccessorStates(location.query)
          this._search()
        }).catch((e)=> {
          console.log(e.stack)
        })
      }
    })
  }

  performSearch(){
    this.searchers.notifyStateChange(this.state)
    let hasSearched = this._search()
    if(hasSearched){
      history.pushState(null, window.location.pathname, this.state)
    }
  }
  search(){
    this.performSearch()
  }

  _search(){
    this.state = this.searchers.getState()
    this.buildQuery()
    let changedSearchers = this.searchers.getChangedSearchers()
    let hasChanged = changedSearchers.size() > 0
    if(hasChanged){
      this.currentSearchRequest && this.currentSearchRequest.deactivate()
      this.currentSearchRequest = new SearchRequest(
        this.host, this.searchers.getChangedSearchers())
        this.currentSearchRequest.run()
    }
    return hasChanged
  }

}
