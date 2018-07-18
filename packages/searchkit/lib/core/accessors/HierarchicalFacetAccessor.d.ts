import { LevelState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
export interface HierarchicalFacetAccessorOptions {
    fields: Array<string>;
    size: number;
    id: string;
    title: string;
    orderKey?: string;
    orderDirection?: string;
}
export declare class HierarchicalFacetAccessor extends FilterBasedAccessor<LevelState> {
    state: LevelState;
    options: any;
    uuids: Array<String>;
    constructor(key: any, options: HierarchicalFacetAccessorOptions);
    computeUuids(): void;
    onResetFilters(): void;
    getBuckets(level: any): any;
    getOrder(): {
        [x: number]: any;
    };
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
