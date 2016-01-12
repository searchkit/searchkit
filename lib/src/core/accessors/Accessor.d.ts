import { State } from "../state";
import { ImmutableQuery } from "../query/ImmutableQuery";
import { Searcher } from "../Searcher";
export declare class Accessor<T extends State<any>> {
    key: string;
    urlKey: string;
    state: T;
    resultsState: T;
    searcher: Searcher;
    constructor(key: any, urlString?: any);
    setSearcher(searcher: any): void;
    translate(key: any): any;
    onStateChange(oldState: any): void;
    fromQueryObject(ob: any): void;
    getQueryObject(): {};
    getResults(): any;
    setResultsState(): void;
    resetState(): void;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
