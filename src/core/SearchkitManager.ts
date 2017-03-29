import {ImmutableQuery} from "./query";
import {Accessor, BaseQueryAccessor, AnonymousAccessor} from "./accessors"
import {AccessorManager} from "./AccessorManager"
import {ESTransport, AxiosESTransport, MockESTransport} from "./transport"
import {SearchRequest} from "./SearchRequest"
import {Utils, EventEmitter} from "./support"
import {VERSION} from "./SearchkitVersion"
import {createHistoryInstance, encodeObjUrl, decodeObjString} from "./history"

import {defaults} from "lodash"
import {constant} from "lodash"
import {identity} from "lodash"
import {map} from "lodash"
import {isEqual} from "lodash"
import {get} from "lodash"
import qs from "qs"

require('es6-promise').polyfill()

import {after} from "lodash"

export interface SearchkitOptions {
  useHistory?:boolean,
  createHistory?:Function,
  getLocation?:Function,
  searchOnLoad?:boolean,
  httpHeaders?:Object,
  basicAuth?:string,
  transport?:ESTransport,
  searchUrlPath?:string,
  timeout?: number
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
  resultsEmitter:EventEmitter
  accessors:AccessorManager
  queryProcessor:Function
  query:ImmutableQuery
  loading:boolean
  initialLoading:boolean
  error:any
  results:any
  VERSION = VERSION
  static VERSION = VERSION

  static mock() {
    let searchkit = new SearchkitManager("/", {
      useHistory:false,
      transport:new MockESTransport()
    })
    searchkit.setupListeners()
    return searchkit
  }

  constructor(host:string, options:SearchkitOptions = {}){
    this.options = defaults(options, {
      useHistory:true,
      httpHeaders:{},
      searchOnLoad:true,
      createHistory:createHistoryInstance,
      getLocation:()=> window.location
    })
    this.host = host

    this.transport = this.options.transport || new AxiosESTransport(host, {
      headers:this.options.httpHeaders,
      basicAuth:this.options.basicAuth,
      searchUrlPath:this.options.searchUrlPath,
      timeout: this.options.timeout
    })
    this.accessors = new AccessorManager()
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
    this.translateFunction = constant(undefined)
    this.queryProcessor = identity
    // this.primarySearcher = this.createSearcher()
    this.query = new ImmutableQuery()
    this.emitter = new EventEmitter()
    this.resultsEmitter = new EventEmitter()
  }

  setupListeners() {
    this.initialLoading = true
    if(this.options.useHistory) {
      this.unlistenHistory()
      this.history = this.options.createHistory()
      this.listenToHistory()
    }
    this.runInitialSearch()
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

  setQueryProcessor(fn:Function){
    this.queryProcessor = fn
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

  addResultsListener(fn){
    return this.resultsEmitter.addListener(fn)
  }

  unlistenHistory(){
    if(this.options.useHistory && this._unlistenHistory){
      this._unlistenHistory()
    }
  }
  listenToHistory(){
    this._unlistenHistory = this.history.listen((location, action)=>{
      if(action === "POP") {
        this._searchWhenCompleted(location)
      }
    })
  }

  _searchWhenCompleted(location){
    this.registrationCompleted.then(()=> {
      this.searchFromUrlQuery(decodeObjString(location.search.replace(/^\?/, "")))
    }).catch((e)=> {
      console.error(e.stack)
    })
  }

  runInitialSearch(){
    if(this.options.searchOnLoad) {
      this._searchWhenCompleted(this.options.getLocation())
    }
  }

  searchFromUrlQuery(query){
    this.accessors.setState(query)
    this._search()
  }

  performSearch(replaceState=false, notifyState=true){
    if(notifyState && !isEqual(this.accessors.getState(), this.state)){
      this.accessors.notifyStateChange(this.state)
    }
    this._search()
    if(this.options.useHistory){
      const historyMethod = (replaceState) ?
        this.history.replace : this.history.push

      let url = this.options.getLocation().pathname + "?" + encodeObjUrl(this.state)
      historyMethod.call(this.history, url)
    }
  }

  buildSearchUrl(extraParams = {}){
    const params = defaults(extraParams, this.state || this.accessors.getState())    
    return this.options.getLocation().pathname + '?' + encodeObjUrl(params)
  }

  reloadSearch(){
    delete this.query
    this.performSearch()
  }

  search(replaceState=false){
    this.performSearch(replaceState)
  }

  _search(){
    this.state = this.accessors.getState()
    let query = this.buildQuery()
    if(this.query && isEqual(query.getJSON(), this.query.getJSON())) {
      return
    }
    this.query = query
    this.loading = true
    this.emitter.trigger()
    let queryObject = this.queryProcessor(this.query.getJSON())
    this.currentSearchRequest && this.currentSearchRequest.deactivate()
    this.currentSearchRequest = new SearchRequest(
      this.transport, queryObject, this)
    this.currentSearchRequest.run()
  }

  setResults(results){
    this.compareResults(this.results, results)
    this.results = results
    this.error = null
    this.accessors.setResults(results)
    this.onResponseChange()
    this.resultsEmitter.trigger(this.results)
  }

  compareResults(previousResults, results){
    let ids  = map(get(results, ["hits", "hits"], []), "_id").join(",")
    let previousIds = get(previousResults, ["hits", "ids"], "")
    if(results.hits){
      results.hits.ids = ids
      results.hits.hasChanged = !(ids && ids === previousIds)
    }

  }

  getHits(){
    return get(this.results, ["hits", "hits"], [])
  }

  getHitsCount(){
    return get(this.results, ["hits", "total"], 0)
  }

  getTime() {
    return get(this.results,"took", 0)
  }

  getSuggestions() {
    return get(this.results,["suggest", "suggestions"], {})
  }

  getQueryAccessor(): BaseQueryAccessor{
    return this.accessors.queryAccessor
  }

  getAccessorsByType(type){
    return this.accessors.getAccessorsByType(type)
  }

  getAccessorByType(type){
    return this.accessors.getAccessorByType(type)
  }

  hasHits(){
    return this.getHitsCount() > 0
  }

  hasHitsChanged(){
    return get(this.results, ["hits", "hasChanged"], true)
  }

  setError(error){
    this.error = error
    console.error(this.error)
    this.results = null
    this.accessors.setResults(null)
    this.onResponseChange()
  }

  onResponseChange(){
    this.loading = false
    this.initialLoading = false
    this.emitter.trigger()
  }

}
