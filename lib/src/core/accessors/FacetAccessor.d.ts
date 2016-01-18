import { ArrayState } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
import { BoolShould } from "../query";
export interface FacetAccessorOptions {
    operator?: string;
    title?: string;
    id?: string;
    size: number;
    facetsPerPage?: number;
    translations?: Object;
}
export interface ISizeOption {
    label: string;
    size: number;
}
export declare class FacetAccessor extends FilterBasedAccessor<ArrayState> {
    state: ArrayState;
    options: any;
    defaultSize: number;
    size: number;
    uuid: string;
    static translations: any;
    translations: any;
    constructor(key: any, options: FacetAccessorOptions);
    getBuckets(): any;
    setViewMoreOption(option: ISizeOption): void;
    getMoreSizeOption(): ISizeOption;
    getCount(): number;
    isOrOperator(): boolean;
    getBoolBuilder(): typeof BoolShould;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
