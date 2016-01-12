import * as React from "react"
import {SearchkitManager} from "../SearchkitManager";
import {ImmutableQuery} from "../query"
import {Accessor} from "../accessors/Accessor"
var block = require('bem-cn');


export class SearchkitComponent<P,S> extends React.Component<P,S> {
  searchkit:SearchkitManager
  accessor:Accessor
  stateListenerUnsubscribe:Function
  bemBlocks:any
  blockClass:string

	static contextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}

  defineBEMBlocks() {
    return null;
  }

  defineAccessor():Accessor{
    return null
  }

  translate(key){
    return this.searchkit.translate(key)
  }

  componentWillMount(){
    this.bemBlocks = _.transform(this.defineBEMBlocks(), (result:any, cssClass, name) => {
      result[name] = block(cssClass);
    })
    this.searchkit = this.context["searchkit"]
    if(this.searchkit){
      this.accessor  = this.defineAccessor()
      if(this.accessor){
        this.searchkit.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(()=> {
        this.forceUpdate()
      })
    }
  }

  getResults(){
    return this.searchkit.results
  }

  getQuery():ImmutableQuery {
    return this.searchkit.query
  }

  isInitialLoading(){
    return this.searchkit.initialLoading
  }

  isLoading(){
    return this.searchkit.loading
  }

  getError(){
    return this.searchkit.error
  }

  componentWillUnmount(){
    if(this.stateListenerUnsubscribe){
		  this.stateListenerUnsubscribe()
    }
	}
}
