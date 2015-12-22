import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import { ESTransport } from "./ESTransport";
export interface SearchkitOptions {
    multipleSearchers?: boolean;
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
    multipleSearchers: boolean;
    primarySearcher: Searcher;
    constructor(host: string, options?: SearchkitOptions);
    addSearcher(searcher: any): any;
    addDefaultQuery(fn: Function): void;
    translate(key: any): any;
    createSearcher(): any;
    getAccessors(): any[];
    resetState(): void;
    getState(): {};
    buildSharedQuery(): ImmutableQuery;
    clearSearcherQueries(): void;
    listenToHistory(history: any): void;
    setAccessorStates(query: any): void;
    notifyStateChange(oldState: any): void;
    performSearch(): void;
    search(): void;
    _search(): void;
}
