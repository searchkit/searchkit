import { ValueState } from "../state/State";
import { Accessor } from "./Accessor";
export declare class PageSizeAccessor extends Accessor<ValueState> {
    size: number;
    state: ValueState;
    constructor(key: any, size: any);
    buildOwnQuery(query: any): any;
}
