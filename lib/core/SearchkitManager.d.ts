import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import { SearchRequest } from "./SearchRequest";
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
    multipleSearchers: boolean;
    primarySearcher: Searcher;
    currentSearchRequest: SearchRequest;
    constructor(host: string, options?: SearchkitOptions);
    addSearcher(searcher: any): any;
    addDefaultQuery(fn: Function): void;
    translate(key: any): any;
    createSearcher(): any;
    getAccessors(): any[];
    resetState(): void;
    getState(): {};
    buildSharedQuery(): ImmutableQuery;
    listenToHistory(history: any): void;
    setAccessorStates(query: any): void;
    notifyStateChange(oldState: any): void;
    performSearch(): void;
    search(): void;
    _search(): void;
}
