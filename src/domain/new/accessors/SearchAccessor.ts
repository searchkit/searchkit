import {ValueState} from "../State"
import Accessor from "./Accessor"
import {SimpleQueryString} from "../QueryBuilders";

export default class SearchAccessor extends Accessor<ValueState> {
  state = new ValueState()
  buildSharedQuery(query){
    return query.addQuery(SimpleQueryString(this.state.getValue()))
  }
  buildOwnQuery(query){
    return query
  }
}
