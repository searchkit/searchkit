import { Searcher } from "./Searcher";
export declare class SearcherCollection {
    searchers: Array<Searcher>;
    constructor(searchers: Array<Searcher>);
    getQueries(): any[];
    setResponses(responses: any): void;
    setError(error: any): void;
}
