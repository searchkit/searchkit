import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import * as rx from "rx";
export declare class SearchkitManager {
    searchers: Array<Searcher>;
    index: string;
    resultsListener: rx.ReplaySubject<any>;
    loadingListener: rx.ReplaySubject<any>;
    loading: boolean;
    private registrationCompleted;
    completeRegistration: Function;
    state: any;
    constructor(index: string);
    addSearcher(searcher: any): void;
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
    performSearch(): void;
    search(): void;
    _search(): void;
}
