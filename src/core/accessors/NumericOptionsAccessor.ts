import {State, ValueState} from "../state"
import {Accessor} from "./Accessor"
import {Range, BoolMust, Aggs, AggsRange} from "../query/QueryBuilders";
import * as _ from "lodash";

export interface NumericOptions {
  field:string
  title:string
  options:[{title:string, from?:number, to?:number}]
  id:string
}

export class NumericOptionsAccessor extends Accessor<ValueState> {

  state = new ValueState()
  options:NumericOptions
  constructor(key, options:NumericOptions){
    super(key)
    this.options = options
  }

  getBuckets(){
    const results = this.getResults()
    const path = ['aggregations',this.key, this.key,'buckets']
    return _.get(results, path, [])
  }

  buildSharedQuery(query) {
    if (this.state.hasValue()) {
      let val:any = _.findWhere(this.options.options, {title:this.state.getValue()})

      let rangeFilter = Range(this.options.field, val.from, val.to, {
        $name:this.translate(this.options.title),
        $value:this.translate(val.title),
        $id:this.options.id,
        $remove:()=> {
          this.state = this.state.clear()
        },
        $disabled: false
      })

      query = query.addFilter(this.key, BoolMust([rangeFilter]))
    }

    return query
  }

  getRanges() {
    return _.compact(_.map(this.options.options, (range:{title:string, from?:number, to?:number}) => {
      return {
        key:range.title,
        from:range.from,
        to:range.to
      };
    }))
  }

  buildOwnQuery(query) {
    return query.setAggs(Aggs(
      this.key,
      query.getFilters(this.key),
      AggsRange(
        this.options.field,
        this.getRanges()
      )
    ))
  }

}
