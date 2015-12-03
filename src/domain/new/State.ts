export class State<T> {
  value:T
  constructor(defaultValue:T=null){
    this.value = defaultValue
  }
  setValue(value:T){
    this.value = value
  }
  getValue() {
    return this.value
  }
}

export class ArrayState extends State<Array<string>> {
}

export class ObjectState extends State<Object>{
}

export class ValueState extends State<string>{
}
