import { Searcher } from "./Searcher";
import { SearcherCollection } from "./SearcherCollection";
import { SearchRequest } from "./SearchRequest";
export interface SearchkitOptions {
    multipleSearchers?: boolean;
}
export declare class SearchkitManager {
    searchers: SearcherCollection;
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
    buildSharedQuery(): any;
    buildQuery(): void;
    resetState(): void;
    listenToHistory(history: any): void;
    performSearch(): void;
    search(): void;
    _search(): void;
}
