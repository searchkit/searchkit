export interface QueryStringOptions {
    analyzer?: string;
    fields?: Array<string>;
    default_operator?: string;
    flags?: string;
    [str: string]: any;
}
export declare function QueryString(query: any, options?: QueryStringOptions): {
    "query_string": any;
};
