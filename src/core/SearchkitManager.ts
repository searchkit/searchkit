
import {State,ArrayState,ObjectState,ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {Searcher} from "./Searcher"
import {createHistory} from "./history";
import {ESTransport} from "./ESTransport";
import {SearcherCollection} from "./SearcherCollection"
import {SearchRequest} from "./SearchRequest"
import {Utils} from "./support"
import * as _ from "lodash"

require('es6-promise').polyfill()

export interface SearchkitOptions {
  multipleSearchers?:boolean,
  useHistory?:boolean,
  httpHeaders?:Object,
  basicAuth?:string
}

export class SearchkitManager {
  searchers:SearcherCollection
  host:string
  private registrationCompleted:Promise<any>
  completeRegistration:Function
  state:any
  translateFunction:Function
  multipleSearchers:boolean
  defaultQueries:Array<Function>
  primarySearcher:Searcher
  currentSearchRequest:SearchRequest
  history
  _unlistenHistory:Function
  options:SearchkitOptions
  transport:ESTransport

  constructor(host:string, options:SearchkitOptions = {}){
    this.options = _.defaults(options, {
      multipleSearchers:false,
      useHistory:true,
      httpHeaders:{}
    })
    this.host = host
    this.transport = new ESTransport(host, {
      headers:this.options.httpHeaders,
      basicAuth:this.options.basicAuth
    })
    this.searchers = new SearcherCollection()
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
    this.defaultQueries = []
    this.translateFunction = _.identity
    this.multipleSearchers = this.options.multipleSearchers
    this.primarySearcher = this.createSearcher()
    if(this.options.useHistory) {
      this.history = createHistory()
      this.listenToHistory()
    }
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

  unlistenHistory(){
    if(this.options.useHistory && this._unlistenHistory){
      this._unlistenHistory()
    }
  }
  listenToHistory(){
    this._unlistenHistory = this.history.listen((location)=>{
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
    if(hasSearched && this.options.useHistory){
      this.history.pushState(null, window.location.pathname, this.state)
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
        this.transport, this.searchers.getChangedSearchers())
        this.currentSearchRequest.run()
    }
    return hasChanged
  }

}
