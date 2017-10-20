
export class GuidGenerator {
  counter:number
  constructor(){
    this.counter = 0
  }

  reset(){
    this.counter = 0
  }

  guid(prefix=""){
    let id = ++this.counter
    return prefix.toString() + id
  }
}
