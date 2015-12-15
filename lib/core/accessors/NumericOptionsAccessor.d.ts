import { ValueState } from "../state";
import { Accessor } from "./Accessor";
export declare class NumericOptionsAccessor extends Accessor<ValueState> {
    state: ValueState;
    options: any;
    constructor(key: any, options: any);
    getBuckets(): any[];
    buildSharedQuery(query: any): any;
    getRanges(): {
        key: string;
        from: number;
        to: number;
    }[];
    buildOwnQuery(query: any): any;
}
