import { Searcher } from "./Searcher";
import { ESTransport } from "./ESTransport";
import { SearcherCollection } from "./SearcherCollection";
import { SearchRequest } from "./SearchRequest";
export interface SearchkitOptions {
    multipleSearchers?: boolean;
    useHistory?: boolean;
    httpHeaders?: Object;
    basicAuth?: string;
}
export declare class SearchkitManager {
    searchers: SearcherCollection;
    host: string;
    private registrationCompleted;
    completeRegistration: Function;
    state: any;
    translateFunction: Function;
    multipleSearchers: boolean;
    defaultQueries: Array<Function>;
    primarySearcher: Searcher;
    currentSearchRequest: SearchRequest;
    history: any;
    _unlistenHistory: Function;
    options: SearchkitOptions;
    transport: ESTransport;
    constructor(host: string, options?: SearchkitOptions);
    addSearcher(searcher: any): any;
    addDefaultQuery(fn: Function): void;
    translate(key: any): any;
    createSearcher(): any;
    buildSharedQuery(): any;
    buildQuery(): void;
    resetState(): void;
    unlistenHistory(): void;
    listenToHistory(): void;
    searchFromUrlQuery(query: any): void;
    performSearch(replaceState?: boolean): void;
    search(replaceState: any): void;
    _search(): boolean;
}
