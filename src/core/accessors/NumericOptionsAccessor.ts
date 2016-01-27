import {State, ValueState} from "../state"
import {FilterBasedAccessor} from "./FilterBasedAccessor"
import {
  RangeQuery,
  RangeBucket, FilterBucket
} from "../query";
const find = require("lodash/find")
const compact = require("lodash/compact")
const map = require("lodash/map")
const filter = require("lodash/filter")

export interface RangeOption {
  title:string, from?:number, to?:number
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
    if (this.state.hasValue()) {
      let val:any = find(this.options.options, {title:this.state.getValue()})

      let rangeFilter = RangeQuery(this.options.field,{
        gte:val.from, lt:val.to
      })
      let selectedFilter = {
        name:this.translate(this.options.title),
        value:this.translate(val.title),
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
      return {
        key:range.title,
        from:range.from,
        to:range.to
      };
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
