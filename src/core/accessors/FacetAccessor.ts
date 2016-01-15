import {ArrayState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {
  TermQuery, TermsBucket, CardinalityMetric,
  BoolShould, BoolMust, SelectedFilter,
  FilterBucket
} from "../query";
import * as _ from "lodash";


export interface FacetAccessorOptions {
  operator?:string,
  title?:string
  id?:string
  size:number
  facetsPerPage?:number,
  translations?:Object
}

export interface ISizeOption {
  label:string
  size:number
}

export class FacetAccessor extends FilterBasedAccessor<ArrayState> {

  state = new ArrayState()
  options:any
  defaultSize:number
  size:number
  uuid:string

  static translations:any = {
    "facets.view_more":"View more",
    "facets.view_less":"View less",
    "facets.view_all":"View all"
  }
  translations = FacetAccessor.translations

  constructor(key, options:FacetAccessorOptions){
    super(key, options.id)
    this.options = options
    this.defaultSize = options.size
    this.options.facetsPerPage = this.options.facetsPerPage || 50
    this.size = this.defaultSize;
    if(options.translations){
      this.translations = _.extend({}, this.translations, options.translations)
    }
  }

  getBuckets(){
    return this.getAggregations([this.key, this.key, "buckets"], [])
  }

  setViewMoreOption(option:ISizeOption) {
    this.size = option.size;
  }

  getMoreSizeOption():ISizeOption {
    var option = {size:0, label:""}
    var total = this.getCount()
    var facetsPerPage = this.options.facetsPerPage

    if (total <= this.defaultSize) return null;

    if (total <= this.size) {
      option = {size:this.defaultSize, label:this.translate("facets.view_less")}
    } else if ((this.size + facetsPerPage) > total) {
      option = {size:total, label:this.translate("facets.view_all")}
    } else if ((this.size + facetsPerPage) < total) {
      option = {size:this.size + facetsPerPage, label:this.translate("facets.view_more")}
    } else if (total ){
      option = null
    }

    return option;
  }

  getCount():number {
    return this.getAggregations([this.key, this.key+"_count", "value"], 0) as number
  }

  isOrOperator(){
    return this.options.operator === "OR"
  }

  getBoolBuilder(){
    return this.isOrOperator() ? BoolShould : BoolMust
  }

  buildSharedQuery(query){
    var filters = this.state.getValue()
    var filterTerms = _.map(filters, TermQuery.bind(null, this.key))
    var selectedFilters:Array<SelectedFilter> = _.map(filters, (filter)=> {
      return {
        name:this.options.title || this.translate(this.key),
        value:this.translate(filter),
        id:this.options.id,
        remove:()=> this.state = this.state.remove(filter)
      }
    })
    var boolBuilder = this.getBoolBuilder()
    if(filterTerms.length > 0){
      query = query.addFilter(this.uuid, boolBuilder(filterTerms))
        .addSelectedFilters(selectedFilters)
    }

    return query
  }

  buildOwnQuery(query){
    var filters = this.state.getValue()
    let excludedKey = (this.isOrOperator()) ? this.uuid : undefined
    return query
      .setAggs(FilterBucket(
        this.key,
        query.getFiltersWithoutKeys(excludedKey),
        TermsBucket(this.key, this.key, {size:this.size}),
        CardinalityMetric(this.key+"_count", this.key)
      ))

  }
}
