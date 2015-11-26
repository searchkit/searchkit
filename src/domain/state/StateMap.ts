import * as _ from "lodash"

export interface BoundStateMap{
  get():Array<any> | any
  getState(val):void
  setState(val):void
  add(val):void
  set(val):void
  toggle(val):void
  contains(val):boolean
  hasKey():boolean
  clear():void
  clearAll():void
  remove(val):void
}

export default class StateMap {
  private state:{
    [key:string]:Array<any>
  }
  
  boundStateMap(key):BoundStateMap{
    return {
      get:this.get.bind(this, key),
      getState:this.getState.bind(this),
      setState:this.setState.bind(this),
      add:this.add.bind(this, key),
      set:this.set.bind(this, key),
      toggle:this.toggle.bind(this, key),
      contains:this.contains.bind(this, key),
      hasKey:this.hasKey.bind(this, key),
      clear:this.clear.bind(this, key),
      clearAll:this.clearAll.bind(this),
      remove:this.remove.bind(this, key)
    }
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
    return !!this.state[key]
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
