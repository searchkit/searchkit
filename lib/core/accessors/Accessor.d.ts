import { State } from "../state/State";
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
    onStateChange(oldState: any): void;
    getResults(): any;
    setResultsState(): void;
    resetState(): void;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
