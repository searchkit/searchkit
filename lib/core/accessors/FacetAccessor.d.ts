import { ArrayState } from "../state/State";
import { Accessor } from "./Accessor";
import { BoolShould } from "../query/QueryBuilders";
export interface FacetAccessorOptions {
    operator?: string;
    title?: string;
}
export declare class FacetAccessor extends Accessor<ArrayState> {
    state: ArrayState;
    options: any;
    constructor(key: any, options: FacetAccessorOptions);
    getBuckets(): any[];
    isOrOperator(): boolean;
    getBoolBuilder(): typeof BoolShould;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
