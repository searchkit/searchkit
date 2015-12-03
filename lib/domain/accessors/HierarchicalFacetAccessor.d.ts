import Accessor from "./Accessor.ts";
import RootBuilder from "../builders/RootBuilder.ts";
export default class HierarchicalFacetAccessor extends Accessor {
    getBuckets(): any[];
    searchReset(): void;
    buildQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
    buildPostQuery(builder: RootBuilder, ...stateValues: Array<any>): void;
}
