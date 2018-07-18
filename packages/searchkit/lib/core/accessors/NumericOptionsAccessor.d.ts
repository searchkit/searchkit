import { ArrayState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
import { FieldOptions, FieldContext } from "../";
export interface RangeOption {
    title: string;
    from?: number;
    to?: number;
    key?: string;
}
export interface NumericOptions {
    field: string;
    title: string;
    options: Array<RangeOption>;
    multiselect?: boolean;
    id: string;
    fieldOptions?: FieldOptions;
}
export declare class NumericOptionsAccessor extends FilterBasedAccessor<ArrayState> {
    state: ArrayState;
    options: NumericOptions;
    fieldContext: FieldContext;
    constructor(key: any, options: NumericOptions);
    getDefaultOption(): any;
    getSelectedOptions(): any;
    getSelectedOrDefaultOptions(): any;
    setOptions(titles: any): void;
    toggleOption(key: any): void;
    getBuckets(): any;
    getDocCount(): any;
    emptyOptionsFilter(option: any): boolean;
    buildSharedQuery(query: any): any;
    getRanges(): any;
    buildOwnQuery(query: any): any;
}
