import * as React from "react"
import {SearchkitManager} from "../SearchkitManager";
import {ImmutableQuery} from "../query"
import {Accessor} from "../accessors/Accessor"
var block = require('bem-cn');

export interface SearchkitComponentProps {
  mod?:string
  translations?:Object
  searchkit?:SearchkitManager
}

export class SearchkitComponent<P extends SearchkitComponentProps,S> extends React.Component<P,S> {
  searchkit:SearchkitManager
  accessor:Accessor
  stateListenerUnsubscribe:Function
  bemBlocks:any
  translations:Object = {}

  static contextTypes = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}

  static propTypes:any = {
    mod :React.PropTypes.string,
    translations: React.PropTypes.objectOf(
      React.PropTypes.string),
    searchkit:React.PropTypes.instanceOf(SearchkitManager)
  }


  defineBEMBlocks() {
    return null;
  }

  defineAccessor():Accessor{
    return null
  }

  translate(key){
    return (
      (this.searchkit.translate(key)) ||
      (this.props.translations && this.props.translations[key]) ||
      this.translations[key] ||
      key
    )
  }

  componentWillMount(){
    this.bemBlocks = _.transform(this.defineBEMBlocks(), (result:any, cssClass, name) => {
      result[name] = block(cssClass);
    })
    this.searchkit = this.props.searchkit || this.context["searchkit"]
    if(this.searchkit){
      this.accessor  = this.defineAccessor()
      if(this.accessor){
        this.accessor = this.searchkit.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(()=> {
        this.forceUpdate()
      })
    }
  }

  getResults(){
    return this.searchkit.results
  }

  getHits(){
    return this.searchkit.getHits()
  }

  getHitsCount(){
    return this.searchkit.getHitsCount()
  }

  hasHits(){
    return this.searchkit.hasHits()
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
