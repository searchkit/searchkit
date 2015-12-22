import { ImmutableQuery } from "./query/ImmutableQuery";
import { Accessor } from "./accessors/Accessor";
import { SearchkitManager } from "./SearchkitManager";
import { EventEmitter } from "./support/EventEmitter";
export declare class Searcher {
    accessors: Array<Accessor<any>>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    searchkitManager: SearchkitManager;
    index: string;
    loading: boolean;
    error: any;
    emitter: EventEmitter;
    constructor();
    setSearchkitManager(searchkitManager: any): void;
    translate(key: any): any;
    hasFiltersOrQuery(): boolean;
    addAccessor(accessor: Accessor<any>): void;
    clearQuery(): void;
    buildQuery(query: any): void;
    getResults(): any;
    setResults(results: any): void;
    setError(error: any): void;
}
