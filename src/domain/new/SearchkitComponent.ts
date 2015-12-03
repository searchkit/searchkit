import * as React from "react"
import SearchkitManager from "./SearchkitManager.ts";
import Accessor from "./accessors/Accessor.ts"
import Searcher from "./Searcher.ts"

export default class SearchkitComponent<P,S> extends React.Component<P,S> {
  searchkit:SearchkitManager
  accessor:Accessor<any>
  searcher:Searcher

	static contextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager),
    searcher:React.PropTypes.instanceOf(Searcher)
	}
  defineAccessor():Accessor<any>{
    return null
  }

  shouldCreateNewSearcher(){
    return false
  }

  componentWillMount(){
    this.searchkit = this.context["searchkit"]
    this.accessor  = this.defineAccessor()
    if(!this.shouldCreateNewSearcher()){
      this.searcher = this.searcher || this.props["searcher"] || this.context["searcher"]
    }

    if(this.accessor){
      // this.searcher.stateManager.registerAccessor(this.accessor)
      if(!this.searcher){
        this.searcher = new Searcher()
        this.searchkit.addSearcher(this.searcher)
      }
      this.searcher.addAccessor(this.accessor)
    }
  }
}
