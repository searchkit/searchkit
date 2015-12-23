import { SearcherCollection } from "./SearcherCollection";
import { ESTransport } from "./ESTransport";
export declare class SearchRequest {
    host: string;
    searchers: SearcherCollection;
    active: boolean;
    transport: ESTransport;
    constructor(host: string, searchers: SearcherCollection);
    run(): void;
    deactivate(): void;
    setResponses(responses: any): void;
    setError(error: any): void;
}
