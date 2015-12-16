import { ValueState } from "../state";
import { Accessor } from "./Accessor";
export interface NumericOptions {
    field: string;
    title: string;
    options: [{
        title: string;
        from?: number;
        to?: number;
    }];
    id: string;
}
export declare class NumericOptionsAccessor extends Accessor<ValueState> {
    state: ValueState;
    options: NumericOptions;
    constructor(key: any, options: NumericOptions);
    getBuckets(): any[];
    buildSharedQuery(query: any): any;
    getRanges(): {
        key: string;
        from: number;
        to: number;
    }[];
    buildOwnQuery(query: any): any;
}
