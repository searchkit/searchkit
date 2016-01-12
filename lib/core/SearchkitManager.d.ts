import { ImmutableQuery } from "./query";
import { AccessorManager } from "./AccessorManager";
import { ESTransport } from "./transport";
import { SearchRequest } from "./SearchRequest";
import { EventEmitter } from "./support";
export interface SearchkitOptions {
    multipleSearchers?: boolean;
    useHistory?: boolean;
    httpHeaders?: Object;
    basicAuth?: string;
    transport?: ESTransport;
}
export declare class SearchkitManager {
    host: string;
    private registrationCompleted;
    completeRegistration: Function;
    state: any;
    translateFunction: Function;
    defaultQueries: Array<Function>;
    currentSearchRequest: SearchRequest;
    history: any;
    _unlistenHistory: Function;
    options: SearchkitOptions;
    transport: ESTransport;
    emitter: EventEmitter;
    accessors: AccessorManager;
    query: ImmutableQuery;
    loading: boolean;
    initialLoading: boolean;
    error: any;
    results: any;
    constructor(host: string, options?: SearchkitOptions);
    addAccessor(accessor: any): any;
    addDefaultQuery(fn: Function): void;
    translate(key: any): any;
    buildQuery(): any;
    resetState(): void;
    unlistenHistory(): void;
    listenToHistory(): void;
    searchFromUrlQuery(query: any): void;
    performSearch(replaceState?: boolean): void;
    search(replaceState: any): void;
    _search(): void;
    setResults(results: any): void;
    setError(error: any): void;
    onResponseChange(): void;
}
