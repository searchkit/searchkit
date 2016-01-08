import { LevelState } from "../state";
import { Accessor } from "./Accessor";
export interface PathFacetAccessorOptions {
    field: string;
    id: string;
    title: string;
}
export declare class NestedFacetAccessor extends Accessor<LevelState> {
    state: LevelState;
    options: any;
    constructor(key: any, options: PathFacetAccessorOptions);
    getBuckets(level: any): any[];
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
