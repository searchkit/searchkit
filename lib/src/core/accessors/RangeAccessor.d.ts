import { FilterBasedAccessor } from "./FilterBasedAccessor";
import { ObjectState } from "../state";
export interface RangeAccessorOptions {
    title: string;
    id: string;
    min: number;
    max: number;
    interval?: number;
    field: string;
}
export declare class RangeAccessor extends FilterBasedAccessor<ObjectState> {
    options: any;
    state: ObjectState;
    constructor(key: any, options: RangeAccessorOptions);
    buildSharedQuery(query: any): any;
    getBuckets(): any;
    getInterval(): any;
    buildOwnQuery(query: any): any;
}
