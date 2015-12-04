import {ValueState} from "../state/State"
import {Accessor} from "./Accessor"
import {SimpleQueryString} from "../query/QueryBuilders";

export class SearchAccessor extends Accessor<ValueState> {
  state = new ValueState()
  buildSharedQuery(query){
    return query.addQuery(SimpleQueryString(this.state.getValue()))
  }
  buildOwnQuery(query){
    return query
  }
}
