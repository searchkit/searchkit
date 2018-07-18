import { StatefulAccessor } from "./StatefulAccessor";
import { ValueState } from "../state";
export declare class PageSizeAccessor extends StatefulAccessor<ValueState> {
    defaultSize: number;
    state: ValueState;
    constructor(defaultSize: number);
    setSize(size: any): void;
    getSize(): number;
    buildSharedQuery(query: any): any;
}
