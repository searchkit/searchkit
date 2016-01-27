export interface RangeQueryOptions {
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    boost?: number;
    format?: string;
    time_zone?: string;
}
export declare function RangeQuery(key: any, options: RangeQueryOptions): {
    range: {};
};
