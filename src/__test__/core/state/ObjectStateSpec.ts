import {ObjectState} from "../../../";

describe("ObjectState", ()=> {
  beforeEach(()=> {
    this.state = new ObjectState({a:"b"})
  })

  afterEach(()=> {
    //test immutability
    expect(this.state.value).toEqual({a:"b"})
  })

  it("value state", ()=> {
    expect(this.state.getValue()).toEqual({a:"b"})
    expect(this.state.clear().getValue()).toEqual({})
  })

})
