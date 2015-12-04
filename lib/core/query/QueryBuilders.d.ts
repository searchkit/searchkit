export declare function BoolMust(val?: any): {
    bool: {
        must: any;
    };
};
export declare function BoolShould(val?: any): {
    bool: {
        must: any;
    };
};
export declare function SimpleQueryString(query: any, options?: {}): {
    "simple_query_string": {};
};
export declare function Term(key: any, value: any): {
    term: {};
};
export declare function Terms(key: any, options: any): {
    terms: {};
};
