import { SearchkitManager, ESTransport } from "searchkit";
import { SuggestGroup } from "./Types";
export declare class SearchkitDatasourceManager {
    searchkit: SearchkitManager;
    transport: ESTransport;
    sources: Array<any>;
    results: Object;
    constructor(searchkit: any);
    isSearchkitSource(): boolean;
    addSource(source: any): void;
    search(query?: string): Promise<SuggestGroup[]>;
    getGroupedResults(): Array<SuggestGroup>;
}
