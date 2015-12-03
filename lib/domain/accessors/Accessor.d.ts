import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";
import { BoundStateMap } from "../state/StateMap.ts";
import Newable from "../../common/Newable.ts";
declare abstract class Accessor {
    key: string;
    options: any;
    searcher: ESClient;
    state: BoundStateMap;
    constructor(key: string, options?: any);
    searchReset(): void;
    buildQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    buildPostQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    setSearcher(searcher: ESClient): void;
    setState(state: BoundStateMap): void;
    search(): void;
    triggerSearchReset(): void;
    findAccessorsByClass(accessorClass: Newable<Accessor>): Accessor[];
    getResults(): any;
}
export default Accessor;
