import {Accessor, StatefulAccessor} from  "./accessors"
import {Utils} from "./support"
import * as _ from "lodash"

export class AccessorManager {

  constructor(public accessors:Array<Accessor> = []) {

  }

  getAccessors(){
    return this.accessors
  }

  getActiveAccessors(){
    return _.filter(this.accessors, {active:true})
  }

  getStatefulAccessors():Array<StatefulAccessor<any>>{
    return _.filter(
      this.accessors,
      Utils.instanceOf(StatefulAccessor)
    )
  }

  add(accessor){
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
