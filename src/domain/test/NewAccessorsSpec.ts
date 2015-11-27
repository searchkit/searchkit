import StateManager from "../state/StateManager.ts";
import FacetAccessor from "../accessors/FacetAccessor.ts";
import SimpleQueryAccessor from "../accessors/SimpleQueryAccessor.ts";
import PaginationAccessor from "../accessors/PaginationAccessor.ts";
import PageSizeAccessor from "../accessors/PageSizeAccessor.ts";

fdescribe("StateManager", ()=>{

  beforeEach(()=>{
    this.stateAccessors = new StateManager(null)
    this.printJson = (ob)=>{
      console.log(JSON.stringify(ob, null, 2))
    }
  })

  xit("FacetAccessor", ()=> {
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

  it("queryAccessor", () => {
    const queryAccessor = this.stateAccessors.registerAccessor(new SimpleQueryAccessor("q"))
    this.stateAccessors.state.set("q", "test")

    let result = this.stateAccessors.getData().getJSON()
    expect(result.query.simple_query_string.query).toBe("test")
  })

  it("paginationAccessor", () => {
    const paginationAccessor = this.stateAccessors.registerAccessor(new PaginationAccessor("page"))
    this.stateAccessors.state.set("page",1)

    expect(this.stateAccessors.getData().getJSON()).toEqual({size:10, from:0})
    this.stateAccessors.state.set("page",2)
    expect(this.stateAccessors.getData().getJSON()).toEqual({size:10, from:10})

  })

  it("pageSizeAccessor", () => {
    const pageSizeAccessor = this.stateAccessors.registerAccessor(new PageSizeAccessor("size"))
    this.stateAccessors.state.set("size", 100)
    expect(this.stateAccessors.getData().getJSON()).toEqual({size:100})
  })
})
