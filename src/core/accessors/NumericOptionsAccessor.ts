import {State, ValueState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {Utils} from "../support"
import {
  RangeQuery,
  RangeBucket, FilterBucket
} from "../query";
const find = require("lodash/find")
const compact = require("lodash/compact")
const map = require("lodash/map")
const filter = require("lodash/filter")
const omitBy = require("lodash/omitBy")
const isUndefined = require("lodash/isUndefined")

export interface RangeOption {
  title:string, from?:number, to?:number, key?:string
}
export interface NumericOptions {
  field:string
  title:string
  options:Array<RangeOption>
  id:string
}

export class NumericOptionsAccessor extends FilterBasedAccessor<ValueState> {

  state = new ValueState()
  options:NumericOptions
  constructor(key, options:NumericOptions){
    super(key)
    this.options = options
    this.options.options = Utils.computeOptionKeys(
      options.options, ["from", "to"], "all"
    )
  }

  getSelectedOption(){
    return find(this.options.options, {key:this.state.getValue()})
  }

  setOption(facetOption){
    let option = find(this.options.options, {title:facetOption.key})
    if(option){
      this.state = this.state.toggle(option.key)
      this.searchkit.performSearch()
    }
  }

  getBuckets(){
    return filter(this.getAggregations(
      [this.key, this.key,"buckets"], []
    ), this.emptyOptionsFilter)
  }

  emptyOptionsFilter(option) {
    return option.doc_count > 0
  }

  buildSharedQuery(query) {
    let selectedOption = this.getSelectedOption()
    if (selectedOption) {

      let rangeFilter = RangeQuery(this.options.field,{
        gte:selectedOption.from, lt:selectedOption.to
      })
      let selectedFilter = {
        name:this.translate(this.options.title),
        value:this.translate(selectedOption.title),
        id:this.options.id,
        remove:()=> {
          this.state = this.state.clear()
        }
      }

      return query
        .addFilter(this.uuid, rangeFilter)
        .addSelectedFilter(selectedFilter)

    }

    return query
  }

  getRanges() {
    return compact(map(this.options.options, (range:RangeOption) => {
      return omitBy({
        key:range.title,
        from:range.from,
        to:range.to
      }, isUndefined);
    }))
  }

  buildOwnQuery(query) {
    return query.setAggs(FilterBucket(
      this.key,
      query.getFiltersWithoutKeys(this.uuid),
      RangeBucket(
        this.key,
        this.options.field,
        this.getRanges()
      )
    ))
  }

}
