import { ArrayState } from "../state";
import { Accessor } from "./Accessor";
export interface FacetAccessorOptions {
    operator?: string;
    title?: string;
    id?: string;
    size: number;
}
export interface ISizeOption {
    label: string;
    size: number;
}
export declare class FacetAccessor extends Accessor<ArrayState> {
    state: ArrayState;
    options: any;
    defaultSize: number;
    size: number;
    constructor(key: any, options: FacetAccessorOptions);
    getBuckets(): any[];
    setViewMoreOption(option: ISizeOption): void;
    getMoreSizeOption(): ISizeOption;
    getCount(): number;
    isOrOperator(): boolean;
    getBoolBuilder(): ((val?: any) => {
        bool: {
            should: any;
        };
        $array: any;
    }) | ((val?: any) => {
        bool: {
            must: any;
        };
        $array: any;
    });
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
