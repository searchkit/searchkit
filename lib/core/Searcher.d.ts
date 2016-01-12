import { ImmutableQuery } from "./query/ImmutableQuery";
import { Accessor } from "./accessors/Accessor";
import { SearchkitManager } from "./SearchkitManager";
import { EventEmitter } from "./support/EventEmitter";
export declare class Searcher {
    accessors: Array<Accessor>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    searchkitManager: SearchkitManager;
    index: string;
    loading: boolean;
    error: any;
    emitter: EventEmitter;
    initialLoading: boolean;
    constructor(searchkitManager: any);
    translate(key: any): any;
    hasFiltersOrQuery(): boolean;
    addAccessor(accessor: Accessor): void;
    clearQuery(): void;
    resetState(): void;
    buildQuery(query: any): ImmutableQuery;
    beginNewSearch(): void;
    getResults(): any;
    setResults(results: any): void;
    setError(error: any): void;
    onResponseChange(): void;
}
