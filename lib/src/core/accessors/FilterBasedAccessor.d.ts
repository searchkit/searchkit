import { StatefulAccessor } from "./StatefulAccessor";
import { State } from "../State";
export declare class FilterBasedAccessor<T extends State<any>> extends StatefulAccessor<T> {
    onResetFilters(): void;
}
