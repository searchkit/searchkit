import { ObjectState } from "../state/State";
import { Accessor } from "./Accessor";
export declare class HierarchicalFacetAccessor extends Accessor<ObjectState> {
    state: ObjectState;
    options: any;
    constructor(key: any, options: any);
}
