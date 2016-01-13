import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export interface SortingOption {
    label: string;
    field: string;
    order: string;
}
export interface SortingOptions {
    options: Array<SortingOption>;
}
export declare class SortingAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: SortingOptions;
    constructor(key: any, options: SortingOptions);
    buildOwnQuery(query: any): any;
}
