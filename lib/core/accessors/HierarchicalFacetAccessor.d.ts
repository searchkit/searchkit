import { ObjectState } from "../state/State";
import { Accessor } from "./Accessor";
export declare class HierarchicalState extends ObjectState {
    value: Object;
    defaultValue: Object;
    lazyInit(): Object;
    add(level: number, val: any): void;
    contains(level: number, val: any): boolean;
    clear(level?: number): void;
    remove(level: number, val: any): void;
    toggle(level: number, val: any): void;
    getLevel(level: number): Array<string>;
    levelHasFilters(level: number): boolean;
}
export declare class HierarchicalFacetAccessor extends Accessor<HierarchicalState> {
    state: HierarchicalState;
    options: any;
    constructor(key: any, options: any);
    getBuckets(level: any): any[];
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
