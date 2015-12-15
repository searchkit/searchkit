import {State} from "../../../";

describe("State", ()=> {
  beforeEach(()=> {
    class ExampleState extends State<number>{

    }
    this.state = new ExampleState(1)
  })

  afterEach(()=> {
    //test immutability
    expect(this.state.value).toEqual(1)
  })

  it("getValue()", ()=> {
    expect(this.state.getValue()).toEqual(1)
  })

  it("create()", ()=> {
    expect(this.state.value).toEqual(1)
    expect(this.state.create(2).value).toEqual(2)
  })

  it("setValue()", ()=> {
    expect(this.state.setValue(2).value).toEqual(2)
  })

  it("hasValue()", ()=> {
    expect(this.state.hasValue()).toBe(true)
    let state = this.state.clear()
    expect(state.hasValue()).toBe(false)
  })

  it("clear()", ()=> {
    expect(this.state.clear().value).toEqual(null)
  })
})
