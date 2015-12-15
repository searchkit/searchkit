import { ValueState } from "../state";
import { Accessor } from "./Accessor";
export declare class SortingAccessor extends Accessor<ValueState> {
    state: ValueState;
    options: any;
    constructor(key: any, options: any);
    buildOwnQuery(query: any): any;
}
