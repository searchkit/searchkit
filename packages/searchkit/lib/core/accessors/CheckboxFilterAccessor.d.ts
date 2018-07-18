import { State } from "../state";
import { FilterBasedAccessor } from "./FilterBasedAccessor";
export interface CheckboxFilterAccessorOptions {
    id: string;
    filter: any;
    title?: string;
    label?: string;
    translations?: Object;
    defaultValue?: boolean;
}
export declare class CheckboxFilterAccessor extends FilterBasedAccessor<State<boolean>> {
    state: State<boolean>;
    options: any;
    uuid: string;
    filter: any;
    static translations: any;
    constructor(key: any, options: CheckboxFilterAccessorOptions);
    getDocCount(): any;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
