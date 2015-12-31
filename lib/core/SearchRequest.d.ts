import { SearcherCollection } from "./SearcherCollection";
export declare class SearchRequest {
    transport: any;
    searchers: SearcherCollection;
    active: boolean;
    constructor(transport: any, searchers: SearcherCollection);
    run(): any;
    deactivate(): void;
    setResponses(responses: any): void;
    setError(error: any): void;
}
