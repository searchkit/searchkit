import {ArrayState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {
  TermQuery, TermsBucket, CardinalityMetric,
  BoolShould, BoolMust, SelectedFilter,
  FilterBucket, NestedBucket
} from "../query";
const assign = require("lodash/assign")
const map = require("lodash/map")
const omitBy = require("lodash/omitBy")
const isUndefined = require("lodash/isUndefined")


export interface FacetAccessorOptions {
  operator?:string
  title?:string
  id?:string
  fieldOptions?: {type: string, terms: Array<string>}
  size:number
  facetsPerPage?:number
  translations?:Object
  include?:Array<string> | string
  exclude?:Array<string> | string
  orderKey?:string
  orderDirection?:string
  min_doc_count?:number
  loadAggregations?: boolean
}

export interface ISizeOption {
  label:string
  size:number
}

export class FacetAccessor extends FilterBasedAccessor<ArrayState> {

  state = new ArrayState()
  options:any
  defaultSize:number
  queryType:string
  nestedTerms: Array<string>
  size:number
  uuid:string
  loadAggregations: boolean

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
    this.nestedTerms = isUndefined(options.fieldOptions) ? [] : options.fieldOptions.terms
    this.queryType = isUndefined(options.fieldOptions) ? `` : options.fieldOptions.type
    this.options.facetsPerPage = this.options.facetsPerPage || 50
    this.size = this.defaultSize;
    this.loadAggregations = isUndefined(this.options.loadAggregations) ? true : this.options.loadAggregations
    if(options.translations){
      this.translations = assign({}, this.translations, options.translations)
    }
  }

  getBuckets(){
    if (this.queryType == "nested") {
      let buckets = this.getAggregations([this.uuid, this.key, this.nestedTerms[0], "buckets"], [])

      // Map name as label on bucket.
      buckets = buckets.map((elem) => {
        const nestedTerm = this.nestedTerms[1]
        return {
          doc_count: elem.doc_count,
          key: elem.key,
          label: elem[nestedTerm].buckets[0].key
        }
      })
      return buckets
    }
    return this.getAggregations([this.uuid, this.key, "buckets"], [])
  }

  getDocCount(){
    if (this.queryType == "nested") {
      return this.getAggregations([this.uuid, this.key, "doc_count"], 0)
    }
    return this.getAggregations([this.uuid, "doc_count"], 0)
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

  getCount():number {
    return this.getAggregations([this.uuid, this.key+"_count", "value"], 0) as number
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
    var term = this.queryType == "nested" ? this.nestedTerms[0] : this.key
    var filterTerms = map(filters, TermQuery.bind(null, term))
    var selectedFilters:Array<SelectedFilter> = map(filters, (filter)=> {
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
    if (!this.loadAggregations){
      return query
    }
    else if (this.queryType == "nested"){
      var filters = this.state.getValue()
      let excludedKey = (this.isOrOperator()) ? this.uuid : undefined

      const nestedTerm = TermsBucket(this.nestedTerms[1], this.nestedTerms[1], omitBy({
        size:this.size,
        order:this.getOrder(),
        include: this.options.include,
        exclude: this.options.exclude,
        min_doc_count:this.options.min_doc_count
      }, isUndefined))

      const nestedTerms = TermsBucket(this.nestedTerms[0], this.nestedTerms[0], omitBy({
        size:this.size,
        order:this.getOrder(),
        include: this.options.include,
        exclude: this.options.exclude,
        min_doc_count:this.options.min_doc_count,
      }), nestedTerm)

      return query
        .setAggs(FilterBucket(
          this.uuid,
          query.getFiltersWithoutKeys(excludedKey),
          NestedBucket(
            this.key,
            this.key,
            nestedTerms,
            CardinalityMetric(this.key+"_count", this.key)
          )))
    }
    else {
      var filters = this.state.getValue()
      let excludedKey = (this.isOrOperator()) ? this.uuid : undefined
      return query
        .setAggs(FilterBucket(
          this.uuid,
          query.getFiltersWithoutKeys(excludedKey),
          TermsBucket(this.key, this.key, omitBy({
            size:this.size,
            order:this.getOrder(),
            include: this.options.include,
            exclude: this.options.exclude,
            min_doc_count:this.options.min_doc_count
          }, isUndefined)),
          CardinalityMetric(this.key+"_count", this.key)
        ))
    }
  }
}
