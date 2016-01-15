import { LevelState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
export interface NestedFacetAccessorOptions {
    field: string;
    id: string;
    title: string;
    orderKey?: string;
    orderDirection?: string;
    startLevel?: number;
}
export declare class NestedFacetAccessor extends FilterBasedAccessor<LevelState> {
    state: LevelState;
    options: any;
    constructor(key: any, options: NestedFacetAccessorOptions);
    onResetFilters(): void;
    getBuckets(level: any): any;
    buildSharedQuery(query: any): any;
    getTermAggs(): {};
    buildOwnQuery(query: any): any;
}
