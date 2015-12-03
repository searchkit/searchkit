import {ValueState} from "../State.ts"
import Accessor from "./Accessor.ts"
import {SimpleQueryString} from "../QueryBuilders.ts";

export default class SearchAccessor extends Accessor<ValueState> {
  state = new ValueState()
  buildSharedQuery(query){
    return query.addQuery(SimpleQueryString(this.state.getValue()))
  }
  buildOwnQuery(query){
    return query
  }
}
