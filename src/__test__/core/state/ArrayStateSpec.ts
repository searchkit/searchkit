import {ArrayState} from "../../../";

describe("ArrayState", ()=> {
  beforeEach(()=> {
    this.state = new ArrayState([1,2,3])
  })

  afterEach(()=> {
    //test immutability
    expect(this.state.value).toEqual([1,2,3])
  })

  it("getValue()", ()=> {
    expect(this.state.getValue()).toEqual([1,2,3])
    expect(this.state.create(null).getValue()).toEqual([])
  })

  it("toggle()", ()=> {
    expect(this.state.toggle(1).getValue())
      .toEqual([2,3])
    expect(this.state.toggle(4).getValue())
      .toEqual([1,2,3,4])
  })

  it("clear()", ()=> {
    expect(this.state.clear().getValue()).toEqual([])
  })

  it("remove()", ()=> {
    expect(this.state.remove(2).getValue()).toEqual([1,3])
  })

  it("add()", ()=> {
    expect(this.state.add(0).getValue()).toEqual([1,2,3,0])
  })

  it("contains()", ()=> {
    expect(this.state.contains(2)).toEqual(true)
    expect(this.state.contains(3)).toEqual(true)
    expect(this.state.contains(4)).toEqual(false)
  })




})
