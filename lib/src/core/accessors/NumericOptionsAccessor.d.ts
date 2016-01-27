import { ValueState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
export interface RangeOption {
    title: string;
    from?: number;
    to?: number;
}
export interface NumericOptions {
    field: string;
    title: string;
    options: Array<RangeOption>;
    id: string;
}
export declare class NumericOptionsAccessor extends FilterBasedAccessor<ValueState> {
    state: ValueState;
    options: NumericOptions;
    constructor(key: any, options: NumericOptions);
    getBuckets(): any;
    emptyOptionsFilter(option: any): boolean;
    buildSharedQuery(query: any): any;
    getRanges(): any;
    buildOwnQuery(query: any): any;
}
