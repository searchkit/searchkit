import {State, ValueState} from "../state"
import {StatefulAccessor} from "./StatefulAccessor"
import {
  RangeQuery, BoolMust,
  RangeBucket, FilterBucket
} from "../query";
import * as _ from "lodash";

export interface RangeOption {
  title:string, from?:number, to?:number
}
export interface NumericOptions {
  field:string
  title:string
  options:Array<RangeOption>
  id:string
  mod?:string
}

export class NumericOptionsAccessor extends StatefulAccessor<ValueState> {

  state = new ValueState()
  options:NumericOptions
  constructor(key, options:NumericOptions){
    super(key)
    this.options = options
  }

  getBuckets(){
    return this.getAggregations(
      [this.key, this.key,"buckets"], []
    )
  }

  buildSharedQuery(query) {
    if (this.state.hasValue()) {
      let val:any = _.findWhere(this.options.options, {title:this.state.getValue()})

      let rangeFilter = RangeQuery(this.options.field, val.from, val.to)
      let selectedFilter = {
        name:this.translate(this.options.title),
        value:this.translate(val.title),
        id:this.options.id,
        remove:()=> {
          this.state = this.state.clear()
        }
      }

      return query
        .addFilter(this.uuid, BoolMust([rangeFilter]))
        .addSelectedFilter(selectedFilter)

    }

    return query
  }

  getRanges() {
    return _.compact(_.map(this.options.options, (range:RangeOption) => {
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
      query.getFiltersWithoutKeys(this.key),
      RangeBucket(
        this.key,
        this.options.field,
        this.getRanges()
      )
    ))
  }

}
