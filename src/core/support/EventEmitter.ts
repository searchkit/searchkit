import {without} from "lodash"
import {each} from "lodash"

export class EventEmitter {
  listeners = []

  addListener(fn){
    this.listeners.push(fn)
    return ()=>{
      this.listeners = without(this.listeners, fn)
    }
  }

  trigger(...args){
    each(this.listeners, (fn)=> {
      fn.apply(null, args)
    })
  }
}
