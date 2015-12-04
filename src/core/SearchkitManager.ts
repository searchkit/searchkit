import {State,ArrayState,ObjectState,ValueState} from "./state/State"
import {ImmutableQuery} from "./query/ImmutableQuery";
import {Accessor} from "./accessors/Accessor"
import {Searcher} from "./Searcher"
import {ESRequest} from "./ESRequest";
import * as rx from "rx";
var Promise = require('es6-promise').Promise
import {history} from "./history";

export class SearchkitManager {
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
    searcher.setSearchkitManager(this)
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

  protected search(){
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
