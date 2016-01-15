import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export interface SearchOptions {
    queryFields?: Array<string>;
    prefixQueryFields?: Array<string>;
    queryOptions?: any;
    disableSuggestions?: boolean;
}
export declare class QueryAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: SearchOptions;
    constructor(key: any, options?: {});
    onQueryStringChange(queryString: any): void;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
