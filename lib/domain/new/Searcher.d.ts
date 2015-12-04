import { ImmutableQuery } from "./ImmutableQuery";
import Accessor from "./accessors/Accessor";
export default class Searcher {
    accessors: Array<Accessor<any>>;
    query: ImmutableQuery;
    queryHasChanged: boolean;
    results: any;
    constructor();
    addAccessor(accessor: Accessor<any>): void;
    buildQuery(query: any): void;
    getResults(): any;
    setResults(results: any): void;
}
