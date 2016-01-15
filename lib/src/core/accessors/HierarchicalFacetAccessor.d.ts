import { LevelState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
export declare class HierarchicalFacetAccessor extends FilterBasedAccessor<LevelState> {
    state: LevelState;
    options: any;
    uuids: Array<String>;
    constructor(key: any, options: any);
    computeUuids(): void;
    onResetFilters(): void;
    getBuckets(level: any): any;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
