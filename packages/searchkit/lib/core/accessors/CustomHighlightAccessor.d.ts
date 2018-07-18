import { Accessor } from "./Accessor";
export declare class CustomHighlightAccessor extends Accessor {
    request: any;
    highlightRequest: any;
    constructor(request: any);
    buildOwnQuery(query: any): any;
}
