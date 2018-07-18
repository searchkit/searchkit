import { FieldOptions } from "./FieldOptions";
export declare abstract class FieldContext {
    fieldOptions: FieldOptions;
    constructor(fieldOptions: FieldOptions);
    abstract getAggregationPath(): any;
    abstract wrapAggregations(...aggs: any[]): Array<any>;
    abstract wrapFilter(filter: any): any;
}
