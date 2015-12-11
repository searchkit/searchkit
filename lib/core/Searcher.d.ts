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
    loading: boolean;
    private listeners;
    constructor();
    setSearchkitManager(searchkitManager: any): void;
    translate(key: any): any;
    addListener(fn: any): () => void;
    triggerListeners(): void;
    setIndex(index: any): void;
    getIndex(): string;
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addAccessor(accessor: Accessor<any>): void;
    buildQuery(query: any): void;
    getCommandAndQuery(): any[];
    getResults(): any;
    setResults(results: any): void;
}
