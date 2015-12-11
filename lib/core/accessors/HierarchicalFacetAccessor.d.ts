import { ObjectState } from "../state/State";
import { Accessor } from "./Accessor";
export declare class HierarchicalState extends ObjectState {
    value: Object;
    defaultValue: Object;
    add(level: number, val: any): any;
    contains(level: number, val: any): boolean;
    clear(level?: number): any;
    remove(level: number, val: any): any;
    toggle(level: number, val: any): any;
    getLevel(level: number): Array<string>;
    levelHasFilters(level: number): boolean;
    removeChilds(level: number): any;
    getLeafLevel(): number;
    isLeafLevel(level: number): boolean;
}
export declare class HierarchicalFacetAccessor extends Accessor<HierarchicalState> {
    state: HierarchicalState;
    options: any;
    constructor(key: any, options: any);
    getBuckets(level: any): any[];
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
