import {ArrayState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {
  TermQuery, TermsBucket, CardinalityMetric,
  BoolShould, BoolMust, SelectedFilter,
  FilterBucket,  FieldContextFactory, FieldContext,
  FieldOptions
} from "../query";
const assign = require("lodash/assign")
const map = require("lodash/map")
const omitBy = require("lodash/omitBy")
const isUndefined = require("lodash/isUndefined")
const each = require("lodash/each")


export interface FacetAccessorOptions {
  operator?:string
  title?:string
  id?:string
  field:string
  size:number
  facetsPerPage?:number
  translations?:Object
  include?:Array<string> | string
  exclude?:Array<string> | string
  orderKey?:string
  orderDirection?:string
  min_doc_count?:number
  loadAggregations?: boolean
  fieldOptions?:FieldOptions
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
  loadAggregations: boolean
  fieldContext:FieldContext

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
    this.loadAggregations = isUndefined(this.options.loadAggregations) ? true : this.options.loadAggregations
    if(options.translations){
      this.translations = assign({}, this.translations, options.translations)
    }
    this.options.fieldOptions = this.options.fieldOptions || {type:"embedded"}
    this.options.fieldOptions.field = this.options.field
    this.fieldContext = FieldContextFactory(this.options.fieldOptions)
  }

  getRawBuckets(){
    return this.getAggregations([
      this.uuid,
      this.fieldContext.getAggregationPath(),
      this.options.field, "buckets"], [])
  }

  getBuckets(){
    let rawBuckets:Array<any> = this.getRawBuckets()
    let keyIndex = {}
    each(rawBuckets, (item)=> {
      item.key = item.key_as_string || String(item.key);
      keyIndex[item.key] = item
    })
    let missingFilters = []
    each(this.state.getValue(), (filterKey)=> {
      if(keyIndex[filterKey]) {
        const filter:any = keyIndex[filterKey]
        filter.selected = true
      } else {
        missingFilters.push({
          key:filterKey, missing:true, selected:true
        })
      }
    })
    let buckets = (missingFilters.length > 0) ?
      missingFilters.concat(rawBuckets) : rawBuckets

    return buckets
  }

  getDocCount(){
    return this.getAggregations([
      this.uuid,
      this.fieldContext.getAggregationPath(),
      "doc_count"], 0)
  }

  getCount():number {
    return this.getAggregations([
      this.uuid,
      this.fieldContext.getAggregationPath(),
      this.options.field+"_count", "value"], 0) as number
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
    } else if ((this.size + facetsPerPage) >= total) {
      option = {size:total, label:this.translate("facets.view_all")}
    } else if ((this.size + facetsPerPage) < total) {
      option = {size:this.size + facetsPerPage, label:this.translate("facets.view_more")}
    } else if (total ){
      option = null
    }

    return option;
  }


  isOrOperator(){
    return this.options.operator === "OR"
  }

  getBoolBuilder(){
    return this.isOrOperator() ? BoolShould : BoolMust
  }

  getOrder(){
    if(this.options.orderKey){
      let orderDirection = this.options.orderDirection || "asc"
      return {[this.options.orderKey]:orderDirection}
    }
  }

  buildSharedQuery(query){
    var filters = this.state.getValue()
    var filterTerms = map(filters, (filter)=> {
      return this.fieldContext.wrapFilter(TermQuery(this.options.field, filter))
    })
    var selectedFilters:Array<SelectedFilter> = map(filters, (filter)=> {
      return {
        name:this.options.title || this.translate(this.options.field),
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
    if (!this.loadAggregations){
      return query
    } else {
      let excludedKey = (this.isOrOperator()) ? this.uuid : undefined
      return query
        .setAggs(FilterBucket(
          this.uuid,
          query.getFiltersWithoutKeys(excludedKey),
          ...this.fieldContext.wrapAggregations(
            TermsBucket(this.options.field, this.options.field, omitBy({
              size:this.size,
              order:this.getOrder(),
              include: this.options.include,
              exclude: this.options.exclude,
              min_doc_count:this.options.min_doc_count
            }, isUndefined)),
            CardinalityMetric(this.options.field+"_count", this.options.field)
          )
        ))
    }
  }
}
