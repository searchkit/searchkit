import { ValueState } from "../state";
import { Accessor } from "./Accessor";
export declare class SearchAccessor extends Accessor<ValueState> {
    state: ValueState;
    buildSharedQuery(query: any): any;
}
