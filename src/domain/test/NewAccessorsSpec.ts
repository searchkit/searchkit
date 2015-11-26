import StateManager from "../state/StateManager.ts";
import FacetAccessor from "../accessors/FacetAccessor.ts";

fdescribe("StateManager", ()=>{

  beforeEach(()=>{
    this.stateAccessors = new StateManager(null)
    this.printJson = (ob)=>{
      console.log(JSON.stringify(ob, null, 2))
    }
  })

  it("FacetAccessor", ()=> {
    this.stateAccessors.registerAccessor(new FacetAccessor("genres"))
    this.stateAccessors.state.add("genres", "action")
    this.stateAccessors.state.add("genres", "comedy")
    this.printJson(this.stateAccessors.getData().getJSON())    
  })
})
