import { FieldContext } from './FieldContext';
export declare class ChildrenFieldContext extends FieldContext {
    constructor(fieldOptions: any);
    getAggregationPath(): string;
    wrapAggregations(...aggregations: any[]): {
        [x: string]: any;
    }[];
    wrapFilter(filter: any): {
        has_child: any;
    };
}
