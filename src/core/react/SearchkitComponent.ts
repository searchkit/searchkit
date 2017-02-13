import * as React from "react"
import {SearchkitManager} from "../SearchkitManager"
import {ImmutableQuery} from "../query"
import {Accessor} from "../accessors/Accessor"
import {Utils} from "../support"
let block = require("bem-cn")
import {keys} from "lodash"
import {without} from "lodash"
import {mapValues} from "lodash"

export interface SearchkitComponentProps {
  mod?:string
  className?:string
  translations?:Object
  searchkit?:SearchkitManager
  key?:string
}

export class SearchkitComponent<P extends SearchkitComponentProps,S> extends React.Component<P,S> {
  searchkit:SearchkitManager
  accessor:Accessor
  stateListenerUnsubscribe:Function
  translations:Object = {}
  unmounted = false

  static contextTypes: React.ValidationMap<any> = {
		searchkit:React.PropTypes.instanceOf(SearchkitManager)
	}

  static translationsPropType = (translations)=> {
    return React.PropTypes.objectOf(React.PropTypes.string)
  }

  static propTypes:any = {
    mod :React.PropTypes.string,
    className :React.PropTypes.string,
    translations: React.PropTypes.objectOf(
      React.PropTypes.string),
    searchkit:React.PropTypes.instanceOf(SearchkitManager)
  }

  constructor(props?){
    super(props)
    this.translate = this.translate.bind(this)
  }

  defineBEMBlocks() {
    return null;
  }

  defineAccessor():Accessor{
    return null
  }

  translate(key, interpolations?){
    let translation = (
      (this.searchkit.translate(key)) ||
      (this.props.translations && this.props.translations[key]) ||
      this.translations[key] || key)
    return Utils.translate(translation, interpolations)
  }

  get bemBlocks(): any {
    return mapValues(this.defineBEMBlocks(), (cssClass) => {
      return block(cssClass)
    })
  }
  _getSearchkit(){
    return this.props.searchkit || this.context["searchkit"]
  }
  componentWillMount(){
    this.searchkit = this._getSearchkit()
    if(this.searchkit){
      this.accessor  = this.defineAccessor()
      if(this.accessor){
        this.accessor = this.searchkit.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(()=> {
        if(!this.unmounted){
          this.forceUpdate();
        }
      })
    } else {
      console.warn("No searchkit found in props or context for " + this.constructor["name"])
    }
  }

  componentWillUnmount(){
    if(this.stateListenerUnsubscribe){
		  this.stateListenerUnsubscribe()
    }
    if(this.searchkit && this.accessor){
      this.searchkit.removeAccessor(this.accessor)
    }
    this.unmounted = true
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

  hasHitsChanged(){
    return this.searchkit.hasHitsChanged()
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


}
