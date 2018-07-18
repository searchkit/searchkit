import { Accessor } from "./Accessor";
import { SourceFilterType } from "../query";
export declare class SourceFilterAccessor extends Accessor {
    source: SourceFilterType;
    constructor(source: SourceFilterType);
    buildSharedQuery(query: any): any;
}
