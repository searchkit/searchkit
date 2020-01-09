export class GuidGenerator {
  counter: number
  constructor() {
    this.counter = 0
  }

  reset() {
    this.counter = 0
  }

  guid(prefix = '') {
    const id = ++this.counter
    return prefix.toString() + id
  }
}
