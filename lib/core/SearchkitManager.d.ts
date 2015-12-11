import { ImmutableQuery } from "./query/ImmutableQuery";
import { Searcher } from "./Searcher";
export declare class SearchkitManager {
    searchers: Array<Searcher>;
    index: string;
    private registrationCompleted;
    completeRegistration: Function;
    state: any;
    translateFunction: Function;
    defaultQueries: Array<Function>;
    constructor(index: string);
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
    performSearch(): void;
    search(): void;
    _search(): void;
}
