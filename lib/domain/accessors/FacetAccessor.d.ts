import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
export default class FacetAccessor extends Accessor {
    getBuckets(): any[];
    searchReset(): void;
    buildQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    isOrOperator(): boolean;
    buildPostQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
}
