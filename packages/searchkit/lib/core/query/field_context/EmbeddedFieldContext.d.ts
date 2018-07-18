import { FieldContext } from "./FieldContext";
export declare class EmbeddedFieldContext extends FieldContext {
    getAggregationPath(): any;
    wrapAggregations(...aggregations: any[]): any[];
    wrapFilter(filter: any): any;
}
