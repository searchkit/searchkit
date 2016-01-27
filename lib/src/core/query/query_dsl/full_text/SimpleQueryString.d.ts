export interface SimpleQueryStringOptions {
    analyzer?: string;
    fields?: Array<string>;
    default_operator?: string;
    flags?: string;
}
export declare function SimpleQueryString(query: any, options?: {}): {
    "simple_query_string": any;
};
