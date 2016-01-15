import { BaseQueryAccessor } from "./BaseQueryAccessor";
export interface SearchOptions {
    queryFields?: Array<string>;
    prefixQueryFields?: Array<string>;
    queryOptions?: any;
    disableSuggestions?: boolean;
}
export declare class QueryAccessor extends BaseQueryAccessor {
    options: SearchOptions;
    constructor(key: any, options?: {});
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
