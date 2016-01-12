import { ImmutableQuery } from "../query/ImmutableQuery";
import { Searcher } from "../Searcher";
export declare class StatelessAccessor {
    searcher: Searcher;
    uuid: string;
    constructor(key: any, urlString?: any);
    setSearcher(searcher: any): void;
    translate(key: any): any;
    getResults(): any;
    getAggregations(path: any, defaultValue: any): any;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
