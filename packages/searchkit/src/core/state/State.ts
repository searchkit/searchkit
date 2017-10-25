

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
  hasValue() {
    return !!(this.value)
  }
}
