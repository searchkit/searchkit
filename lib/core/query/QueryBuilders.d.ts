export declare function BoolMust(val?: any): {
    bool: {
        must: any;
    };
    $array: any;
};
export declare function BoolMustNot(val?: any): {
    bool: {
        must_not: any;
    };
    $array: any;
};
export declare function BoolShould(val?: any): {
    bool: {
        should: any;
    };
    $array: any;
};
export declare function SimpleQueryString(query: any, options?: {}): {
    "simple_query_string": {};
};
export interface TermOptions {
    $name?: string;
    $value?: string | number;
    $remove?: Function;
    $disabled?: boolean;
    $id?: string;
    [prop: string]: any;
}
export declare function Term(key: any, value: any, options?: TermOptions): {};
export declare function Terms(key: any, options: any): {
    terms: {};
};
export declare function Range(key: any, from: any, to: any, options?: TermOptions): {};
