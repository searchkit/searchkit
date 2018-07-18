export interface TermsBucketOptions {
    size?: number;
    order?: any;
    include?: Array<string> | string;
    exclude?: Array<string> | string;
    min_doc_count?: number;
}
export declare const DefaultNumberBuckets: number;
export declare function TermsBucket(key: any, field: any, options?: TermsBucketOptions, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function RangeBucket(key: any, field: any, ranges: any, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function ChildrenBucket(key: any, type: any, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function FilterBucket(key: any, filter: any, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function NestedBucket(key: any, path: any, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function SignificantTermsBucket(key: any, field: any, options?: {}, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function GeohashBucket(key: any, field: any, options: any, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function HistogramBucket(key: any, field: any, options?: {}, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function GeoboundsBucket(key: any, field: any, options?: {}, ...childAggs: any[]): {
    [x: string]: any;
};
export declare function DateHistogramBucket(key: any, field: any, options?: {}, ...childAggs: any[]): {
    [x: string]: any;
};
