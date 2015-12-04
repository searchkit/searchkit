import Searcher from "../Searcher"
import SearchkitManager from "../SearchkitManager"
import Accessor from "../accessors/Accessor";
import {ValueState} from "../State"
import {SimpleQueryString} from "../QueryBuilders";
import SearchAccessor from "../accessors/SearchAccessor"

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
