import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export interface SortingOptions {
    options: [{
        label: string;
        field: string;
        order: string;
    }];
    mod?: string;
}
export declare class SortingAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: SortingOptions;
    constructor(key: any, options: SortingOptions);
    buildOwnQuery(query: any): any;
}
