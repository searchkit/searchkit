import * as React from "react"
import ESClient from "../domain/ESClient.ts";
import Accessor from "../domain/accessors/Accessor.ts";

export default class SearchkitComponent<P,S> extends React.Component<P,S> {
  searcher:ESClient
  accessor:Accessor

	static contextTypes = {
		searcher:React.PropTypes.instanceOf(ESClient)    
	}
  defineAccessor():Accessor{
    return null
  }
  componentWillMount(){
    this.searcher = this.context["searcher"]
    this.accessor  = this.defineAccessor()
    if(this.accessor){
      this.searcher.stateManager.registerAccessor(this.accessor)
    }
  }
}
