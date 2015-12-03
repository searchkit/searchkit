import Accessor from "../accessors/Accessor.ts";
import StateMap from "./StateMap.ts";
import RootBuilder from "../builders/RootBuilder.ts";
import ESClient from "../ESClient.ts";
import Newable from "../../common/Newable.ts";
export default class StateAcessors {
    searcher: ESClient;
    state: StateMap;
    stateAccessors: Array<Accessor>;
    constructor(searcher: ESClient);
    registerAccessor<T extends Accessor>(accessor: T): T;
    findAccessorsByClass<T extends Accessor>(accessorClass: Newable<T>): Array<T>;
    invokeAccessors(method: any, ...args: any[]): void;
    searchReset(): void;
    getData(): RootBuilder;
    updateHistory(): void;
}
