import {ValueState} from "../../../";

describe("ValueState", ()=> {
  beforeEach(()=> {
    this.state = new ValueState("foo")
  })

  afterEach(()=> {
    //test immutability
    expect(this.state.value).toEqual("foo")
  })

  it("value state", ()=> {
    expect(this.state.getValue()).toEqual("foo")
    expect(this.state.create("bar").value).toEqual("bar")
    expect(this.state.setValue("bar").value).toEqual("bar")
    expect(this.state.clear().value).toEqual(null)
  })

  it("toggle()", ()=> {
    let state = this.state.toggle("bar")
    expect(state.getValue()).toBe("bar")
    state = state.toggle("bar")
    expect(state.getValue()).toBe(null)

  })

})
