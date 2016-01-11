export interface TermsBucketOptions {
    size?: number;
}
export declare function TermsBucket(key: any, field: any, options?: TermsBucketOptions, ...childAggs: any[]): {};
export declare function RangeBucket(key: any, field: any, ranges: any, ...childAggs: any[]): {};
export declare function ChildrenBucket(key: any, type: any, ...childAggs: any[]): {};
export declare function FilterBucket(key: any, filter: any, ...childAggs: any[]): {};
export declare function NestedBucket(key: any, path: any, ...childAggs: any[]): {};
export declare function SignificantTermsBucket(key: any, field: any, ...childAggs: any[]): {};
