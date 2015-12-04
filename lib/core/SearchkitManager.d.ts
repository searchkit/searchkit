import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
import * as rx from "rx";
export declare class SearchkitManager {
    searchers: Array<Searcher>;
    index: string;
    resultsListener: rx.ReplaySubject<any>;
    private registrationCompleted;
    completeRegistration: Function;
    constructor(index: string);
    addSearcher(searcher: any): void;
    createSearcher(): Searcher;
    getAccessors(): any[];
    iterateAccessors(fn: any): void;
    resetState(): void;
    getState(): {};
    buildSharedQuery(): ImmutableQuery;
    makeQueryDef(): {
        queries: any[];
        searchers: any[];
    };
    listenToHistory(history: any): void;
    setAccessorStates(query: any): void;
    performSearch(): void;
    protected search(): void;
}
