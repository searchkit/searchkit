export interface SimpleQueryStringOptions {
    analyzer?: string;
    fields?: Array<string>;
    default_operator?: string;
    flags?: string;
    [str: string]: any;
}
export declare function SimpleQueryString(query: any, options?: SimpleQueryStringOptions): {
    "simple_query_string": any;
};
