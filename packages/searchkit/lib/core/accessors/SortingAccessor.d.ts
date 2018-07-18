import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export interface SortingField {
    field: string;
    options: Object;
}
export interface SortingOption {
    label: string;
    field?: string;
    order?: string;
    defaultOption?: boolean;
    key?: string;
    fields?: Array<SortingField>;
}
export interface SortingOptions {
    options: Array<SortingOption>;
}
export declare class SortingAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: SortingOptions;
    constructor(key: any, options: SortingOptions);
    getSelectedOption(): any;
    getSortQuery(sortOption: any): any;
    buildOwnQuery(query: any): any;
}
