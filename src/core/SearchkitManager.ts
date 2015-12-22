
import {State,ArrayState,ObjectState,ValueState} from "./state"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {Searcher} from "./Searcher"
import {history} from "./history";
import {ESTransport} from "./ESTransport";
import * as _ from "lodash"

require('es6-promise').polyfill()

export interface SearchkitOptions {
  multipleSearchers?:boolean
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
  multipleSearchers:boolean
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
    this.multipleSearchers = options.multipleSearchers || false
    this.primarySearcher = this.createSearcher()
  }
  addSearcher(searcher){
    this.searchers.push(searcher)
    return searcher
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

  getAccessors(){
    return _.chain(this.searchers)
      .pluck("accessors")
      .flatten()
      .value()
  }

  resetState(){
    _.invoke(this.searchers, "resetState")
  }

  getState(){
    return _.reduce(this.getAccessors(), (state, accessor)=> {
      return _.extend(state, accessor.getQueryObject())
    }, {})
  }

  buildSharedQuery(){
    var query = new ImmutableQuery()
    query = _.reduce(this.defaultQueries, (currentQuery, fn)=>{
      return fn(currentQuery)
    }, query)

    return _.reduce(this.getAccessors(), (query, accessor)=>{
      return accessor.buildSharedQuery(query)
    }, query)
  }

  clearSearcherQueries(){
    _.invoke(this.searchers, "clearQuery")
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
    _.invoke(this.getAccessors(), "fromQueryObject", query)
  }

  notifyStateChange(oldState){
    _.invoke(this.getAccessors(), "onStateChange", oldState)
  }

  performSearch(){
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
    var query = this.buildSharedQuery()
    _.invoke(this.searchers, "buildQuery", query)
    let changedSearchers = _.filter(this.searchers, {queryHasChanged:true})
    let queries = _.map(changedSearchers, (searcher)=> {
      return searcher.query.getJSON()
    })

    console.log("multiqueries", queries)
    if(queries.length > 0) {
      this.transport.search(queries).then((responses)=> {
        _.each(responses, (results, index)=>{
          changedSearchers[index].setResults(results)
        })
      }).catch((error)=> {
        _.invoke(changedSearchers, "setError", error)
      })
    }
  }

}
