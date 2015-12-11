import { ArrayState } from "../state/State";
import { Accessor } from "./Accessor";
export interface FacetAccessorOptions {
    operator?: string;
    title?: string;
    id?: string;
}
export declare class FacetAccessor extends Accessor<ArrayState> {
    state: ArrayState;
    options: any;
    constructor(key: any, options: FacetAccessorOptions);
    getBuckets(): any[];
    isOrOperator(): boolean;
    getBoolBuilder(): ((val?: any) => {
        bool: {
            should: any;
        };
        $array: any;
    }) | ((val?: any) => {
        bool: {
            must: any;
        };
        $array: any;
    });
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
