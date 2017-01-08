import {ImmutableQuery} from "../query/ImmutableQuery";
import {SearchkitManager} from "../SearchkitManager";
import {Utils} from "../support"
import {get} from "lodash"
import {compact} from "lodash"

export class Accessor {
  searchkit:SearchkitManager
  uuid:string
  results:any
  active:boolean
  translations:Object
  refCount:number
  constructor(){
    this.uuid = Utils.guid()
    this.active = true
    this.translations = {}
    this.refCount = 0
  }

  incrementRef(){
    this.refCount++
  }

  decrementRef(){
    this.refCount--
  }

  setActive(active:boolean){
    this.active = active
    return this
  }

  setSearchkitManager(searchkit){
    this.searchkit = searchkit
  }


  translate(key, interpolations?){
    let translation = (
      (this.searchkit && this.searchkit.translate(key)) ||
       this.translations[key] ||
       key)
    return Utils.translate(translation, interpolations)
  }

  getResults(){
    return this.results
  }

  setResults(results){
    this.results = results
  }

  getAggregations(path, defaultValue){
    const results = this.getResults()
    const getPath = compact(['aggregations',...path])
    return get(results, getPath, defaultValue)
  }

  beforeBuildQuery(){

  }
  buildSharedQuery(query:ImmutableQuery){
    return query
  }
  buildOwnQuery(query:ImmutableQuery){
    return query
  }
}
