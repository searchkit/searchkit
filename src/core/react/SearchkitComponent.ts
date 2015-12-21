import * as React from "react"
import {SearchkitManager} from "../SearchkitManager";
import {Accessor} from "../accessors/Accessor"
import {Searcher} from "../Searcher"
var block = require('bem-cn');


export class SearchkitComponent<P,S> extends React.Component<P,S> {
  searchkit:SearchkitManager
  accessor:Accessor<any>
  searcher:Searcher
  stateListenerUnsubscribe:Function
  bemBlocks:any
  blockClass:string

	static contextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager),
    searcher:React.PropTypes.instanceOf(Searcher)
	}

  constructor(props) {
    super(props)
  }

  defineBEMBlocks() {
    return null;
  }

  defineAccessor():Accessor<any>{
    return null
  }

  shouldCreateNewSearcher(){
    return false
  }

  translate(key){
    return this.searchkit.translate(key)
  }

  componentWillMount(){
    this.searchkit = this.context["searchkit"]
    this.accessor  = this.defineAccessor()
    this.bemBlocks = _.transform(this.defineBEMBlocks(), (result:any, cssClass, name) => {
      result[name] = block(cssClass);
    })
    if(!this.shouldCreateNewSearcher() || this.searchkit.searchMode === "single"){
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
    if(this.searcher){
      this.stateListenerUnsubscribe = this.searcher.addListener(()=> {
        this.forceUpdate()
      })
    }

  }

  isLoading(){
    return this.searcher && this.searcher.loading
  }

  getError(){
    return this.searcher && this.searcher.error
  }

  componentWillUnmount(){
    if(this.stateListenerUnsubscribe){
		  this.stateListenerUnsubscribe()
    }
	}
}
