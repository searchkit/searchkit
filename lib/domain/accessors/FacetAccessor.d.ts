import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
export default class FacetAccessor extends Accessor {
    getBuckets(): any[];
    searchReset(): void;
    buildQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    isOrOperator(): boolean;
    buildPostQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
}
