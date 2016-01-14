export interface MatchQueryOptions {
    operator?: string;
    zero_terms_query?: string;
    analyzer?: string;
    type?: string;
    cutoff_frequency?: number;
    max_expansions?: number;
}
export declare function MatchQuery(field: any, query: any, options?: MatchQueryOptions): {
    match: {};
};
