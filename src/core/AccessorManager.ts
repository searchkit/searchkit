import {Accessor, StatefulAccessor, BaseQueryAccessor, noopQueryAccessor} from  "./accessors"
import {Utils} from "./support"
import {ImmutableQuery} from "./query"
import * as _ from "lodash"

type StatefulAccessors = Array<StatefulAccessor<any>>

export class AccessorManager {

  accessors:Array<Accessor>
  statefulAccessors:{}
  queryAccessor:BaseQueryAccessor

  constructor() {
    this.accessors = []
    this.queryAccessor = noopQueryAccessor
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
      if(accessor instanceof BaseQueryAccessor){
        if(this.queryAccessor !== noopQueryAccessor){
          throw new Error("Only a single instance of BaseQueryAccessor is allowed")
        } else {
          this.queryAccessor = accessor
        }
      }
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

  getQueryAccessor(){
    return this.queryAccessor
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

  buildQuery(){
    return this.buildOwnQuery(
      this.buildSharedQuery(new ImmutableQuery())
    )
  }

  setResults(results){
    _.each(this.accessors, a => a.setResults(results))
  }

  resetState(){
    _.each(this.getStatefulAccessors(), a => a.resetState())
  }

}
