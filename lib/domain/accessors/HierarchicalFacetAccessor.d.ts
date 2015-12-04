import Accessor from "./Accessor";
import RootBuilder from "../builders/RootBuilder";
export default class HierarchicalFacetAccessor extends Accessor {
    getBuckets(): any[];
    searchReset(): void;
    buildQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    buildPostQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
}
