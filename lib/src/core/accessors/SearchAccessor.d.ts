import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export interface SearchOptions {
    queryFields?: Array<string>;
    prefixQueryFields?: Array<string>;
    queryOptions?: any;
}
export declare class SearchAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: SearchOptions;
    constructor(key: any, options?: {});
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
