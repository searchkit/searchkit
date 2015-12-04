import { ImmutableQuery } from "./ImmutableQuery";
import Accessor from "./accessors/Accessor";
import SearchkitManager from "./SearchkitManager";
export default class Searcher {
    accessors: Array<Accessor<any>>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    searchkitManager: SearchkitManager;
    search_type: string;
    constructor();
    setSearchkitManager(searchkitManager: any): void;
    addAccessor(accessor: Accessor<any>): void;
    buildQuery(query: any): void;
    getCommandAndQuery(): any[];
    getResults(): any;
    setResults(results: any): void;
}
