import { ValueState } from "../State";
import Accessor from "./Accessor";
export default class SearchAccessor extends Accessor<ValueState> {
    state: ValueState;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
