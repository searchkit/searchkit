import {Accessor, StatefulAccessor, BaseQueryAccessor, noopQueryAccessor} from  "./accessors"
import {Utils} from "./support"
import {ImmutableQuery} from "./query"
const filter = require("lodash/filter")
const values = require("lodash/values")
const reduce = require("lodash/reduce")
const assign = require("lodash/assign")
const each = require("lodash/each")

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
    return filter(this.accessors, {active:true})
  }

  getStatefulAccessors(){
    return values(this.statefulAccessors) as StatefulAccessors
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
    return reduce(this.getStatefulAccessors(), (state, accessor)=> {
      return assign(state, accessor.getQueryObject())
    }, {})
  }

  setState(state){
    each(
      this.getStatefulAccessors(),
      accessor=>accessor.fromQueryObject(state)
    )
  }
  notifyStateChange(oldState){
    each(
      this.getStatefulAccessors(),
      accessor => accessor.onStateChange(oldState)
    )
  }

  getQueryAccessor(){
    return this.queryAccessor
  }

  buildSharedQuery(query){
    return reduce(this.getActiveAccessors(), (query, accessor)=>{
      return accessor.buildSharedQuery(query)
    }, query)
  }

  buildOwnQuery(query){
    return reduce(this.getActiveAccessors(), (query, accessor)=>{
      return accessor.buildOwnQuery(query)
    }, query)
  }

  buildQuery(){
    return this.buildOwnQuery(
      this.buildSharedQuery(new ImmutableQuery())
    )
  }

  setResults(results){
    each(this.accessors, a => a.setResults(results))
  }

  resetState(){
    each(this.getStatefulAccessors(), a => a.resetState())
  }

}
