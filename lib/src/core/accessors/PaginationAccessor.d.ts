import { ValueState } from "../state";
import { StatefulAccessor } from "./StatefulAccessor";
export declare class PaginationAccessor extends StatefulAccessor<ValueState> {
    state: ValueState;
    onStateChange(oldState?: {}): void;
    buildOwnQuery(query: any): any;
}
