import { State } from "../State";
import { ImmutableQuery } from "../ImmutableQuery";
import Searcher from "../Searcher";
export default class Accessor<T extends State<any>> {
    key: string;
    urlKey: string;
    state: T;
    searcher: Searcher;
    constructor(key: any, urlString?: any);
    setSearcher(searcher: any): void;
    getResults(): any;
    buildSharedQuery(query: ImmutableQuery): ImmutableQuery;
    buildOwnQuery(query: ImmutableQuery): ImmutableQuery;
}
