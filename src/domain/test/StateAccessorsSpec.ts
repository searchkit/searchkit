import StateAccessors from "../StateAccessors.ts";
var update = require("react-addons-update")

fdescribe("Accessors", ()=>{

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
    expect(this.stateAccessors.getData()).toEqual({
      query:{
        query:"terminator"
      },
      facets:{f1:"foo", f2:"bar"}
    })
  })


  it("test", ()=>{        
    this.stateAccessors.registerAccessor(/^f_(\w+)$/, (key, data, state)=>{      
      data = _.defaults(data, {
        query:{bool:{filters:[]}}
      })
      data.query.bool.filters.push({
        term:{[key]:state}
      })
      return data      
    })
    
    this.stateAccessors.registerAccessor("foo", (key, data, state)=>{
      data.bar = state
      return data 
    })
    // this.stateAccessors.registerAccessor("f_actors", (data, a1, a2)=>{
    //   data.facets = {
    //     f1:a1,
    //     f2:a2
    //   }
    // })
    this.stateAccessors.setState("f_genres", "bar")
    this.stateAccessors.setState("f_color", "red")    
    console.log(this.stateAccessors.toQueryString())  
    this.stateAccessors.fromQueryString("f_author=cameron&f_type=action&foo=weee")
    console.log(JSON.stringify(this.stateAccessors.getData(), null, 2))
  })


})
