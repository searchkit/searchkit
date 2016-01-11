import { LevelState } from "../state";
import { Accessor } from "./Accessor";
export interface NestedFacetAccessorOptions {
    field: string;
    id: string;
    title: string;
    orderKey?: string;
    orderDirection?: string;
    startLevel?: number;
}
export declare class NestedFacetAccessor extends Accessor<LevelState> {
    state: LevelState;
    options: any;
    constructor(key: any, options: NestedFacetAccessorOptions);
    getBuckets(level: any): any;
    buildSharedQuery(query: any): any;
    getTermAggs(): {};
    buildOwnQuery(query: any): any;
}
