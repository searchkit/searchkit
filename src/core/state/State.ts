import * as _ from "lodash"

export class State<T> {
  value: T
  constructor(value=null) {
    this.value = value
  }
  create(value){
    return new (<any>this.constructor)(value)    
  }
  setValue(value: T) {
    return this.create(value)
  }
  clear(){
    return this.create(null)
  }
  getValue() {
    return this.value
  }
}

export class ArrayState extends State<Array<string|number>> {
  lazyInit() {
    return this.value || []
  }
  toggle(val) {
    if (this.contains(val)) {
      return this.remove(val)
    } else {
      return this.add(val)
    }
  }
  clear(){
    return this.create([])
  }
  remove(val) {
    return this.create(_.without(this.lazyInit(), val))
  }
  add(val) {
    return this.create(this.lazyInit().concat(val))
  }
  contains(val) {
    return _.contains(this.value, val)
  }
}

export class ObjectState extends State<Object>{
  lazyInit() {
    return this.value || {}
  }
}

export class ValueState extends State<string|number>{
}
