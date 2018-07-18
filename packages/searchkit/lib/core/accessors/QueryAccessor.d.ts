import { BaseQueryAccessor } from "./BaseQueryAccessor";
export interface SearchOptions {
    queryFields?: Array<string>;
    queryOptions?: any;
    prefixQueryFields?: Array<string>;
    prefixQueryOptions?: Object;
    title?: string;
    addToFilters?: boolean;
    queryBuilder?: Function;
    onQueryStateChange?: Function;
}
export declare class QueryAccessor extends BaseQueryAccessor {
    options: SearchOptions;
    constructor(key: any, options?: {});
    fromQueryObject(ob: any): void;
    buildSharedQuery(query: any): any;
}
