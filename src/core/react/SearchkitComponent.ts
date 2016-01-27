import * as React from "react"
import {SearchkitManager} from "../SearchkitManager";
import {ImmutableQuery} from "../query"
import {Accessor} from "../accessors/Accessor"
import {Utils} from "../support"
var block = require('bem-cn');
const keys = require("lodash/keys")
const without = require("lodash/without")
const transform = require("lodash/transform")

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

  static translationsPropType = (translations)=> {
    return (props, propName, componentName) =>{
      let specifiedTranslations = props[propName]
      let translationKeys = keys(translations)
      let missing = without(
        keys(specifiedTranslations),
        ...translationKeys)
      if(missing.length > 0){
        return new Error(
          componentName + ": incorrect translations, " +
          missing.toString() + " keys are not included in " +
          translationKeys.toString())
      }
      return null
    }
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

  translate(key, interpolations?){
    let translation = (
      (this.searchkit.translate(key)) ||
      (this.props.translations && this.props.translations[key]) ||
      this.translations[key] || key)
    return Utils.translate(translation, interpolations)
  }

  _computeBemBlocks(){
    return transform(this.defineBEMBlocks(), (result:any, cssClass, name) => {
      result[name] = block(cssClass);
    })
  }
  _getSearchkit(){
    return this.props.searchkit || this.context["searchkit"]
  }
  componentWillMount(){
    this.bemBlocks = this._computeBemBlocks()
    this.searchkit = this._getSearchkit()
    if(this.searchkit){
      this.accessor  = this.defineAccessor()
      if(this.accessor){
        this.accessor = this.searchkit.addAccessor(this.accessor)
      }
      this.stateListenerUnsubscribe = this.searchkit.emitter.addListener(()=> {
        this.forceUpdate()
      })
    } else {
      console.warn("No searchkit found in props or context for " + this.constructor["name"])
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
