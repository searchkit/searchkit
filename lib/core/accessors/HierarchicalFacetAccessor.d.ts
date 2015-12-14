import { LevelState } from "../state";
import { Accessor } from "./Accessor";
export declare class HierarchicalFacetAccessor extends Accessor<LevelState> {
    state: LevelState;
    options: any;
    constructor(key: any, options: any);
    getBuckets(level: any): any[];
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
