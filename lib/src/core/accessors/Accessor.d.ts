import { ImmutableQuery } from "../query/ImmutableQuery";
import { SearchkitManager } from "../SearchkitManager";
export declare class Accessor {
    searchkit: SearchkitManager;
    uuid: string;
    results: any;
    active: boolean;
    constructor();
    setActive(active: boolean): Accessor;
    setSearchkitManager(searchkit: any): void;
    translate(key: any): any;
    getResults(): any;
    setResults(results: any): void;
    getAggregations(path: any, defaultValue: any): any;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
