import {ImmutableQuery} from "./query";
import {Accessor, BaseQueryAccessor, AnonymousAccessor} from "./accessors"
import {AccessorManager} from "./AccessorManager"
import {createHistory} from "./history";
import {ESTransport, AxiosESTransport, MockESTransport} from "./transport";
import {SearchRequest} from "./SearchRequest"
import {Utils, EventEmitter} from "./support"
import {VERSION} from "./SearchkitVersion"
const defaults = require("lodash/defaults")
const constant = require("lodash/constant")
const isEqual = require("lodash/isEqual")
const get = require("lodash/get")

require('es6-promise').polyfill()

export interface SearchkitOptions {
  useHistory?:boolean,
  httpHeaders?:Object,
  basicAuth?:string,
  transport?:ESTransport
}

export class SearchkitManager {
  host:string
  private registrationCompleted:Promise<any>
  completeRegistration:Function
  state:any
  translateFunction:Function
  currentSearchRequest:SearchRequest
  history
  _unlistenHistory:Function
  options:SearchkitOptions
  transport:ESTransport
  emitter:EventEmitter
  accessors:AccessorManager

  query:ImmutableQuery
  loading:boolean
  initialLoading:boolean
  error:any
  results:any
  VERSION = VERSION
  static VERSION = VERSION

  static mock() {
    return new SearchkitManager("/", {
      useHistory:false,
      transport:new MockESTransport()
    })
  }

  constructor(host:string, options:SearchkitOptions = {}){
    this.options = defaults(options, {
      useHistory:true,
      httpHeaders:{}
    })
    this.host = host

    this.transport = this.options.transport || new AxiosESTransport(host, {
      headers:this.options.httpHeaders,
      basicAuth:this.options.basicAuth
    })
    this.accessors = new AccessorManager()
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
    this.translateFunction = constant(undefined)
    // this.primarySearcher = this.createSearcher()
    this.query = new ImmutableQuery()
    this.emitter = new EventEmitter()
    this.initialLoading = true
    if(this.options.useHistory) {
      this.history = createHistory()
      this.listenToHistory()
    }
  }
  addAccessor(accessor){
    accessor.setSearchkitManager(this)
    return this.accessors.add(accessor)
  }

  removeAccessor(accessor){
    this.accessors.remove(accessor)
  }

  addDefaultQuery(fn:Function){
    return this.addAccessor(new AnonymousAccessor(fn))
  }

  translate(key){
    return this.translateFunction(key)
  }

  buildQuery(){
    return this.accessors.buildQuery()
  }

  resetState(){
    this.accessors.resetState()
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
          this.searchFromUrlQuery(location.query)
        }).catch((e)=> {
          console.error(e.stack)
        })
      }
    })
  }

  searchFromUrlQuery(query){
    this.accessors.setState(query)
    this._search()
  }

  performSearch(replaceState=false){
    if(!isEqual(this.accessors.getState(), this.state)){
      this.accessors.notifyStateChange(this.state)
    }
    this._search()
    if(this.options.useHistory){
      const historyMethod = (replaceState) ?
        this.history.replaceState : this.history.pushState
      historyMethod(null, window.location.pathname, this.state)
    }
  }

  search(replaceState=false){
    this.performSearch(replaceState)
  }

  _search(){
    this.state = this.accessors.getState()
    this.query = this.buildQuery()
    this.loading = true
    this.emitter.trigger()
    this.currentSearchRequest && this.currentSearchRequest.deactivate()
    this.currentSearchRequest = new SearchRequest(
      this.transport, this.query, this)
    this.currentSearchRequest.run()
  }

  setResults(results){
    this.results = results
    this.error = null
    this.accessors.setResults(results)
    this.onResponseChange()
  }

  getHits(){
    return get(this.results, ["hits", "hits"], [])
  }

  getHitsCount(){
    return get(this.results, ["hits", "total"], 0)
  }

  getSuggestions() {
    return get(this.results,["suggest", "suggestions"], {})
  }

  getQueryAccessor(): BaseQueryAccessor{
    return this.accessors.queryAccessor
  }

  hasHits(){
    return this.getHitsCount() > 0
  }

  setError(error){
    this.error = error
    this.onResponseChange()
  }

  onResponseChange(){
    this.loading = false
    this.initialLoading = false
    this.emitter.trigger()
  }

}
