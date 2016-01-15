import {ImmutableQuery} from "../query/ImmutableQuery";
import {SearchkitManager} from "../SearchkitManager";
import {Utils} from "../support"

export class Accessor {
  searchkit:SearchkitManager
  uuid:string
  results:any
  active:boolean
  translations:Object
  constructor(){
    this.uuid = Utils.guid()
    this.active = true
    this.translations = {}
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

  onQueryStringChange(queryStr){

  }

  onResetFilters(){

  }

  getAggregations(path, defaultValue){
    const results = this.getResults()
    const getPath = ['aggregations',...path]
    return _.get(results, getPath, defaultValue)
  }

  buildSharedQuery(query:ImmutableQuery){
    return query
  }
  buildOwnQuery(query:ImmutableQuery){
    return query
  }
}
