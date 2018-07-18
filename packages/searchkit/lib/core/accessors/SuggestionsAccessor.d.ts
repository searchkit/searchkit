import { Accessor } from "./Accessor";
export declare class SuggestionsAccessor extends Accessor {
    field: string;
    constructor(field: string);
    getSuggestion(): any;
    buildOwnQuery(query: any): any;
}
