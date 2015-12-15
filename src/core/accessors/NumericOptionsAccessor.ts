import {State, ObjectState} from "../state"
import {Accessor} from "./Accessor"
import {Range, BoolMust} from "../query/QueryBuilders";
import * as _ from "lodash";

export class NumericOptionsAccessor extends Accessor<ObjectState> {

  state = new ObjectState()
  options:any
  constructor(key, options:any){
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
      let val:any = this.state.getValue()

      let rangeFilter = Range(this.options.field, val.from, val.to, {
        $name:this.translate(this.options.title),
        $value:this.translate(val.key),
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
    query = query.setAggs({
      [this.key]:{
        filter:query.getFilters(this.key),
        aggs:{
          [this.key]:{
            "range": {
              "field":this.options.field,
              "ranges": this.getRanges()
            }
          }

        }
      }
    })

    return query;
  }

}
