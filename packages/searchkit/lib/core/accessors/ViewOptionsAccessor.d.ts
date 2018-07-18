import { StatefulAccessor } from "./StatefulAccessor";
import { ValueState } from "../../core";
export declare class ViewOptionsAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    options: Array<any>;
    constructor(key: any, options: Array<any>);
    getSelectedOption(): any;
    setView(key: any): void;
    search(): void;
}
