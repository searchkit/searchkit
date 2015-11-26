import StateAccessors from "../StateAccessors.ts";
var update = require("react-addons-update")

describe("Accessors", ()=>{

  beforeEach(()=>{
    this.stateAccessors = new StateAccessors()
  })

  it("test", ()=>{
    this.stateAccessors.registerAccessor("q", (key, data, state)=>{
      data.query = {
        query:state
      }

      return data
    })
    this.stateAccessors.registerAccessor("f", (key, data, a1, a2)=>{
      data.facets = {
        f1:a1,
        f2:a2
      }
    })
    this.stateAccessors.setState("q", "terminator")
    this.stateAccessors.setState("f", "foo", "bar")
    this.stateAccessors.fromQueryString(this.stateAccessors.toQueryString())
    expect(this.stateAccessors.getData()).toEqual({
      query:{
        query:"terminator"
      },
      facets:{f1:"foo", f2:"bar"}
    })
  })




})
