import {ImmutableQuery} from "./query";
import {Accessor} from "./accessors/Accessor"
import {AccessorManager} from "./AccessorManager"
import {createHistory} from "./history";
import {ESTransport, AxiosESTransport} from "./transport";
import {SearchRequest} from "./SearchRequest"
import {Utils, EventEmitter} from "./support"
import * as _ from "lodash"

require('es6-promise').polyfill()

export interface SearchkitOptions {
  multipleSearchers?:boolean,
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
  defaultQueries:Array<Function>
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

  constructor(host:string, options:SearchkitOptions = {}){
    this.options = _.defaults(options, {
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
    this.defaultQueries = []
    this.translateFunction = _.constant(undefined)
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

  addDefaultQuery(fn:Function){
    this.defaultQueries.push(fn)
  }

  translate(key){
    return this.translateFunction(key)
  }

  buildQuery(){
    var query = Utils.collapse(
      this.defaultQueries, new ImmutableQuery())
    return this.accessors.buildQuery(query)
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
          console.log(e.stack)
        })
      }
    })
  }

  searchFromUrlQuery(query){
    this.accessors.setState(query)
    this._search()
  }

  performSearch(replaceState=false){
    if(!_.isEqual(this.accessors.getState(), this.state)){
      this.accessors.notifyStateChange(this.state)
    }
    this._search()
    if(this.options.useHistory){
      const historyMethod = (replaceState) ?
        this.history.replaceState : this.history.pushState
      historyMethod(null, window.location.pathname, this.state)
    }
  }

  search(replaceState){
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
