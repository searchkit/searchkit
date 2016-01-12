import { Searcher } from "./Searcher";
export declare class SearcherCollection {
    searchers: Array<Searcher>;
    constructor(searchers?: Array<Searcher>);
    getAccessors(): any[];
    getStatefulAccessors(): any[];
    add(searcher: any): any;
    size(): number;
    getState(): {};
    setAccessorStates(query: any): void;
    notifyStateChange(oldState: any): void;
    getChangedSearchers(): SearcherCollection;
    buildSharedQuery(query: any): any;
    buildQuery(query: any): void;
    getQueries(): any[];
    setResponses(responses: any): void;
    setError(error: any): void;
    resetState(): void;
}
