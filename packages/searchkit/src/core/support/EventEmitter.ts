const without = require("lodash/without")
const each = require("lodash/each")

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

  clear(){
    this.listeners = []
  }
}
