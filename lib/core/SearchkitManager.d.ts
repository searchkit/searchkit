import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import { ESTransport } from "./ESTransport";
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
    constructor(host: string);
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
