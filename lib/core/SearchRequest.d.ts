import { ESTransport } from "./transport";
import { ImmutableQuery } from "./query";
import { SearchkitManager } from "./SearchkitManager";
export declare class SearchRequest {
    transport: ESTransport;
    query: ImmutableQuery;
    searchkit: SearchkitManager;
    active: boolean;
    constructor(transport: ESTransport, query: ImmutableQuery, searchkit: SearchkitManager);
    run(): Promise<{}>;
    deactivate(): void;
    setResults(results: any): void;
    setError(error: any): void;
}
