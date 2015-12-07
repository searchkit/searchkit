import { ImmutableQuery } from "./query/ImmutableQuery";
import { Accessor } from "./accessors/Accessor";
import { SearchkitManager } from "./SearchkitManager";
export declare enum SearchType {
    count = 0,
    query_then_fetch = 1,
    scan = 2,
}
export declare class Searcher {
    accessors: Array<Accessor<any>>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    searchkitManager: SearchkitManager;
    search_type: SearchType;
    index: string;
    constructor();
    setSearchkitManager(searchkitManager: any): void;
    setIndex(index: any): void;
    getIndex(): string;
    hasFilters(): boolean;
    addAccessor(accessor: Accessor<any>): void;
    buildQuery(query: any): void;
    getCommandAndQuery(): any[];
    getResults(): any;
    setResults(results: any): void;
}
