import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import { ESTransport } from "./ESTransport";
export interface SearchkitOptions {
    searchMode?: string;
}
export declare class SearchkitManager {
    searchers: Array<Searcher>;
    host: string;
    private registrationCompleted;
    completeRegistration: Function;
    state: any;
    translateFunction: Function;
    defaultQueries: Array<Function>;
    transport: ESTransport;
    performSearch: Function;
    searchMode: string;
    primarySearcher: Searcher;
    constructor(host: string, options?: SearchkitOptions);
    addSearcher(searcher: any): void;
    addDefaultQuery(fn: Function): void;
    translate(key: any): any;
    createSearcher(): Searcher;
    getAccessors(): any[];
    iterateAccessors(fn: any): void;
    resetState(): void;
    getState(): {};
    hasState(): boolean;
    buildSharedQuery(): ImmutableQuery;
    clearSearcherQueries(): void;
    makeQueryDef(): {
        queries: any[];
        searchers: any[];
    };
    listenToHistory(history: any): void;
    setAccessorStates(query: any): void;
    notifyStateChange(oldState: any): void;
    _performSearch(): void;
    search(): void;
    _search(): void;
}
