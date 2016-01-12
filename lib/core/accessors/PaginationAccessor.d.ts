import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export declare class PaginationAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    onStateChange(oldState: any): void;
    buildOwnQuery(query: any): any;
}
