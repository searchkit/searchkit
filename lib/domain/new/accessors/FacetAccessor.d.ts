import { ArrayState } from "../State";
import Accessor from "./Accessor";
import { BoolShould } from "../QueryBuilders";
export default class FacetAccessor extends Accessor<ArrayState> {
    state: ArrayState;
    options: any;
    constructor(key: any, options: any);
    getBuckets(): any[];
    isOrOperator(): boolean;
    getBoolBuilder(): typeof BoolShould;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
