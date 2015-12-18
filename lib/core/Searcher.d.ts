import { ImmutableQuery } from "./query/ImmutableQuery";
import { Accessor } from "./accessors/Accessor";
import { SearchkitManager } from "./SearchkitManager";
export declare class Searcher {
    accessors: Array<Accessor<any>>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    searchkitManager: SearchkitManager;
    index: string;
    loading: boolean;
    error: any;
    private listeners;
    constructor();
    setSearchkitManager(searchkitManager: any): void;
    translate(key: any): any;
    addListener(fn: any): () => void;
    triggerListeners(): void;
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addAccessor(accessor: Accessor<any>): void;
    clearQuery(): void;
    buildQuery(query: any): void;
    getCommandAndQuery(): any[];
    getResults(): any;
    setResults(results: any): void;
    setError(error: any): void;
}
