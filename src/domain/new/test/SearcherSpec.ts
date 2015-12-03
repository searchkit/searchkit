import {Searcher, SearchkitManager, Accessor} from "../Searcher.ts"
import {ValueState} from "../State.ts"
import {SimpleQueryString} from "../Builders.ts";
fdescribe("Searcher Test", ()=>{

  beforeEach(()=>{
    this.searchkit = new SearchkitManager()

    class SearchAccessor extends Accessor<ValueState> {
      state = new ValueState()
      buildSharedQuery(query){
        return query.addQuery(SimpleQueryString(this.state.getValue()))
      }
      buildOwnQuery(query){
        return query
      }
    }

    this.searcher = new Searcher()
    this.accessor = new SearchAccessor()
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
    this.printJSON(this.searchkit.search())
    this.printJSON(this.searchkit.search())
    this.accessor.state.setValue("hello2")
    this.printJSON(this.searchkit.search())
  })
});
