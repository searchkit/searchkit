import StateAccessors from "../StateAccessors.ts";

describe("Accessors", ()=>{

  beforeEach(()=>{
    this.stateAccessors = new StateAccessors()
  })

  it("test", ()=>{
    this.stateAccessors.registerAccessor("q", (data, state)=>{
      data.query = {
        query:state
      }
    })
    this.stateAccessors.registerAccessor("f", (data, a1, a2)=>{
      data.facets = {
        f1:a1,
        f2:a2
      }
    })
    this.stateAccessors.setState("q", "terminator")
    this.stateAccessors.setState("f", "foo", "bar")
    expect(this.stateAccessors.getData()).toEqual({
      query:{
        query:"terminator"
      },
      facets:{f1:"foo", f2:"bar"}
    })
  })


})
