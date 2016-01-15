import {Accessor, StatefulAccessor} from  "./accessors"
import {Utils} from "./support"
import * as _ from "lodash"

type StatefulAccessors = Array<StatefulAccessor<any>>

export class AccessorManager {

  accessors:Array<Accessor>
  statefulAccessors:{}
  constructor() {
    this.accessors = []
    this.statefulAccessors = {}
  }

  getAccessors(){
    return this.accessors
  }

  getActiveAccessors(){
    return _.filter(this.accessors, {active:true})
  }

  getStatefulAccessors(){
    return _.values(this.statefulAccessors) as StatefulAccessors
  }

  add(accessor){
    if(accessor instanceof StatefulAccessor){
      let existingAccessor = this.statefulAccessors[accessor.key]
      if(existingAccessor){
        return existingAccessor
      } else {
        this.statefulAccessors[accessor.key] = accessor
      }
    }
    this.accessors.push(accessor)
    return accessor
  }

  getState(){
    return _.reduce(this.getStatefulAccessors(), (state, accessor)=> {
      return _.extend(state, accessor.getQueryObject())
    }, {})
  }

  setState(state){
    _.each(
      this.getStatefulAccessors(),
      accessor=>accessor.fromQueryObject(state)
    )
  }
  notifyStateChange(oldState){
    _.each(
      this.getStatefulAccessors(),
      accessor => accessor.onStateChange(oldState)
    )
  }

  setQueryString(query){
    _.each(
      this.getActiveAccessors(),
      a => a.onQueryStringChange(query)
    )
  }

  resetFilters(){
    _.each(
      this.getActiveAccessors(),
      a => a.onResetFilters()
    )
  }

  buildSharedQuery(query){
    return _.reduce(this.getActiveAccessors(), (query, accessor)=>{
      return accessor.buildSharedQuery(query)
    }, query)
  }

  buildOwnQuery(query){
    return _.reduce(this.getActiveAccessors(), (query, accessor)=>{
      return accessor.buildOwnQuery(query)
    }, query)
  }

  buildQuery(query){
    return this.buildOwnQuery(
      this.buildSharedQuery(query)
    )
  }

  setResults(results){
    _.each(this.accessors, a => a.setResults(results))
  }

  resetState(){
    _.each(this.getStatefulAccessors(), a => a.resetState())
  }

}
