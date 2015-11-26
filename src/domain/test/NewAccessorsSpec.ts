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
    const genreAccessor = this.stateAccessors.registerAccessor(
      new FacetAccessor("genres"))
    const authorAccessor = this.stateAccessors.registerAccessor(
      new FacetAccessor("authors", {operator:"OR"}))
    this.stateAccessors.state.add("genres", "action")
    genreAccessor.state.add("action")
    
    this.stateAccessors.state.add("authors", "joe")
    authorAccessor.state.add('ash')    
    
    this.printJson(this.stateAccessors.getData().getJSON())    
  })
})
