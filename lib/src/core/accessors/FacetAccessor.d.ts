import { ArrayState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
import { BoolShould } from "../query";
export interface FacetAccessorOptions {
    operator?: string;
    title?: string;
    id?: string;
    size: number;
    facetsPerPage?: number;
}
export interface ISizeOption {
    label: string;
    size: number;
}
export declare class FacetAccessor extends StatefulAccessor<ArrayState> {
    state: ArrayState;
    options: any;
    defaultSize: number;
    size: number;
    uuid: string;
    translations: {
        "facets.view_more": string;
        "facets.view_less": string;
        "facets.view_all": string;
    };
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
