import { ValueState } from "../state";
import { Accessor } from "./Accessor";
export interface SortingOptions {
    options: [{
        label: string;
        field: string;
        order: string;
    }];
    mod?: string;
}
export declare class SortingAccessor extends Accessor<ValueState> {
    state: ValueState;
    options: SortingOptions;
    constructor(key: any, options: SortingOptions);
    buildOwnQuery(query: any): any;
}
