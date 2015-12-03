import Searcher from "../Searcher.ts"
import SearchkitManager from "../SearchkitManager.ts"
import Accessor from "../accessors/Accessor.ts";
import {ValueState} from "../State.ts"
import {SimpleQueryString} from "../QueryBuilders.ts";
import SearchAccessor from "../accessors/SearchAccessor.ts"

fdescribe("Searcher Test", ()=>{

  beforeEach(()=>{
    this.searchkit = new SearchkitManager("assets")

    this.searcher = new Searcher()
    this.accessor = new SearchAccessor("q")
    this.searcher.addAccessor(this.accessor)
    this.searchkit.addSearcher(this.searcher)
    this.accessor.state.setValue("hello")
    this.printJSON = (ob)=> {
      console.log(JSON.stringify(ob, null, 2))
    }

  })

  it("hello", ()=>{
    console.log("hello", Searcher, SearchkitManager,Accessor)
  })

  it("search", ()=>{
    this.printJSON(this.searchkit.makeQueryDef().queries)
    this.printJSON(this.searchkit.makeQueryDef().queries)
    this.accessor.state.setValue("hello2")
    this.printJSON(this.searchkit.makeQueryDef().queries)
  })
});
