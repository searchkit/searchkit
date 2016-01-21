export interface MultiMatchOptions {
    fields: Array<string>;
    type?: string;
    tie_breaker?: number;
    operator?: string;
    minimum_should_match?: string;
    analyzer?: string;
}
export declare function MultiMatchQuery(query: any, options: MultiMatchOptions): {
    multi_match: any;
};
