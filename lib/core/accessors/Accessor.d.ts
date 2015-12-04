import { State } from "../state/State";
import { ImmutableQuery } from "../query/ImmutableQuery";
import { Searcher } from "../Searcher";
export declare class Accessor<T extends State<any>> {
    key: string;
    urlKey: string;
    state: T;
    searcher: Searcher;
    constructor(key: any, urlString?: any);
    setSearcher(searcher: any): void;
    getResults(): any;
    resetState(): void;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
