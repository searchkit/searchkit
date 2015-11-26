import * as _ from "lodash"

export default class StateMap {
  private state:{
    [key:string]:Array<any>
  }

  constructor(){
    this.state = {}
  }

  get(key){
    return this.state[key]
  }

  getState(){
    return this.state
  }

  setState(state){
    this.state = state 
  }

  add(key, val){
    this.lazyInitKey(key).push(val)
  }

  set(key, val){
    this.state[key] = val
  }

  toggle(key, val){
    if(this.contains(key, val)){
      this.remove(key,val)
    } else {
      this.add(key, val)
    }
  }

  contains(key, val){
    return this.state[key] && _.contains(this.state[key], val)
  }

  hasKey(key){
    !!this.state[key]
  }

  clear(key){
    delete this.state[key]
  }

  clearAll(){
    this.state = {}
  }

  remove(key, val){
    if(this.hasKey(key)){
      this.state[key] = _.without(this.state[key], val)
    }
  }

  lazyInitKey(key){
    return (this.state[key] = this.state[key] || [])
  }

}
