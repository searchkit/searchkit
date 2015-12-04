import Accessor from "../accessors/Accessor";
import StateMap from "./StateMap";
import RootBuilder from "../builders/RootBuilder";
import ESClient from "../ESClient";
import Newable from "../../common/Newable";
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
