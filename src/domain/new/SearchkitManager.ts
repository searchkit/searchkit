import {State,ArrayState,ObjectState,ValueState} from "./State.ts"
import {ImmutableQuery} from "./ImmutableQuery.ts";
import Accessor from "./accessors/Accessor.ts"
import Searcher from "./Searcher.ts"
import ESRequest from "./ESRequest.ts";
import * as rx from "rx";
var Promise = require('es6-promise').Promise
import history from "../history.ts";

export default class SearchkitManager {
  searchers:Array<Searcher>
  index:string
  resultsListener: rx.ReplaySubject<any>
  private registrationCompleted:Promise<any>
  completeRegistration:Function

  constructor(index:string){
    this.index = index
    this.searchers = []
    this.resultsListener = new rx.ReplaySubject(1)
		this.registrationCompleted = new Promise((resolve)=>{
			this.completeRegistration = resolve
		})
  }
  addSearcher(searcher){
    this.searchers.push(searcher)
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

  getState(){
    var state = {}
    this.iterateAccessors((accessor)=>{
      state[accessor.urlKey] = accessor.state.getValue()
    })
    return state
  }

  buildSharedQuery(){
    var query = new ImmutableQuery()
    this.iterateAccessors((accessor)=>{
      query = accessor.buildSharedQuery(query)
    })
    return query
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
        queryDef.queries.push(searcher.query.getJSON())
        queryDef.searchers.push(searcher)
      }
    })
    return queryDef
  }

  listenToHistory(history){
    history.listen((location)=>{
      this.registrationCompleted.then(()=>{
        this.setAccessorStates(location.query)
        this.search()
      })

    })
  }

  setAccessorStates(query){
    this.iterateAccessors((accessor)=>{
      var value = query[accessor.urlKey]
      accessor.state.setValue(value)
    })
  }

  performSearch(){
    var state = this.getState()
    console.log("state", state, this.getAccessors())
    history.pushState(null, window.location.pathname, state)
  }

  search(){
    var queryDef = this.makeQueryDef()
    console.log("multiqueries", queryDef.queries)
    if(queryDef.queries.length > 0) {
      var request = new ESRequest(this.index)
      request.search(queryDef.queries).then((response)=> {
        _.each(response["responses"], (results, index)=>{
          queryDef.searchers[index].setResults(results)
        })
        this.resultsListener.onNext(response)
      })
    }
  }

}
