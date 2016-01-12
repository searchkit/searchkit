import { Accessor } from "./Accessor";
export declare class HighlightAccessor extends Accessor {
    fields: Array<string>;
    highlightFields: any;
    constructor(fields: Array<string>);
    computeHighlightedFields(fields: any): {
        fields: {};
    };
    buildOwnQuery(query: any): any;
}
