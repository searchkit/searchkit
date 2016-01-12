import { Accessor } from "./Accessor";
export declare class PageSizeAccessor extends Accessor {
    size: number;
    constructor(size: number);
    buildOwnQuery(query: any): any;
}
