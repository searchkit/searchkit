import {ValueState} from "../state/State"
import {Accessor} from "./Accessor"
import {SimpleQueryString} from "../query/QueryBuilders";
import * as _ from "lodash"

export class PaginationAccessor extends Accessor<ValueState> {
  state = new ValueState()

  buildOwnQuery(query){
    let from = (query.query.size || 20) * Number(this.state.getValue()) - 1
    from = _.max([0, from])
    return query.setFrom(from)
  }
}
