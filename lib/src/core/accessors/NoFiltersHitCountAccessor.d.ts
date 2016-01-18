import { Accessor } from "./Accessor";
export declare class NoFiltersHitCountAccessor extends Accessor {
    aggsKey: string;
    getCount(): any;
    buildOwnQuery(query: any): any;
}
