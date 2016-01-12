import { LevelState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export declare class HierarchicalFacetAccessor extends StatefulAccessor<LevelState> {
    state: LevelState;
    options: any;
    uuids: Array<String>;
    constructor(key: any, options: any);
    computeUuids(): void;
    getBuckets(level: any): any;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
