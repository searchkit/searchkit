import * as _ from "lodash"

export class EventEmitter {
  private listeners = []


  addListener(fn){
    this.listeners.push(fn)
    return ()=>{
      this.listeners = _.without(this.listeners, fn)
    }
  }

  trigger(...args){
    _.each(this.listeners, (fn)=> {
      fn.apply(null, args)
    })
  }
}
