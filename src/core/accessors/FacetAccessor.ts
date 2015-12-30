import {ArrayState} from "../state"
import {Accessor} from "./Accessor"
import {
  Term, Terms, Aggs, Cardinality,
  BoolShould, BoolMust
} from "../query/QueryBuilders";
import * as _ from "lodash";


export interface FacetAccessorOptions {
  operator?:string,
  title?:string
  id?:string
  size:number
}

export interface ISizeOption {
  label:string
  size:number
}

export class FacetAccessor extends Accessor<ArrayState> {

  state = new ArrayState()
  options:any
  defaultSize:number
  size:number
  constructor(key, options:FacetAccessorOptions){
    super(key, options.id)
    this.options = options
    this.defaultSize = options.size
    this.size = this.defaultSize;
  }

  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  setViewMoreOption(option:ISizeOption) {
    this.size = option.size;
  }

  getMoreSizeOption():ISizeOption {
    var option = {
      size:0,
      label:""
    }
    var total = this.getCount()

    if (total <= this.defaultSize) return null;

    if (total <= this.size) {
      option = {size:this.defaultSize, label:"view less"}
    } else if ((this.size + 50) > total) {
      option = {size:total, label:"view all"}
    } else if ((this.size + 50) < total) {
      option = {size:this.size + 50, label:"view more"}
    } else if (total ){
      option = null
    }

    return option;
  }

  getCount():number {
    let key = this.key+"_count";
    const results = this.getResults()
    const path = ['aggregations',key, key,'value']
    return _.get(results, path, 0)
  }

  isOrOperator(){
    return this.options.operator === "OR"
  }

  getBoolBuilder(){
    return this.isOrOperator() ? BoolShould : BoolMust
  }

  buildSharedQuery(query){
    var filters = this.state.getValue()
    var filterTerms = _.map(filters, (filter)=> {
      return Term(this.key, filter, {
        $name:this.options.title || this.translate(this.key),
        $value:this.translate(filter),
        $id:this.options.id,
        $disabled: false,
        $remove:()=> {
          this.state = this.state.remove(filter)
        }
      })
    } );
    var boolBuilder = this.getBoolBuilder()
    if(filterTerms.length > 0){
      query = query.addFilter(this.key, boolBuilder(filterTerms))
    }
    return query
  }

  buildOwnQuery(query){
    var filters = this.state.getValue()
    let excludedKey = (this.isOrOperator()) ? this.key : undefined
    return query
      .setAggs(Aggs(
        this.key,
        query.getFilters(excludedKey),
        Terms(this.key, {size:this.size})
      ))
      .setAggs(Aggs(
        this.key+"_count",
        query.getFilters(excludedKey),
        Cardinality(this.key)
      ))

  }
}
