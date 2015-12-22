import {EventEmitter} from "../../../"


describe("EventEmitter", ()=> {

  beforeEach(()=> {
    this.emitter = new EventEmitter()
  })

  it("constructor()", ()=> {
    expect(this.emitter.listeners).toEqual([])
  })

  it("add, trigger, remove", ()=> {
    let argsStr = ""
    let fn = (...args)=> {
      argsStr = args.join("")
    }
    let removeFn = this.emitter.addListener(fn)
    expect(this.emitter.listeners)
      .toEqual([fn])
    this.emitter.trigger("a", "b", "c")
    expect(argsStr).toEqual("abc")

    removeFn()
    expect(this.emitter.listeners).toEqual([])

  })


})
