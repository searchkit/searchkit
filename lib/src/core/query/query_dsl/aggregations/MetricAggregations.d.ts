export declare function FieldMetricFactory(metricOp: any): (key: any, field: any) => {};
export declare const CardinalityMetric: (key: any, field: any) => {};
export declare const MinMetric: (key: any, field: any) => {};
export declare const MaxMetric: (key: any, field: any) => {};
export declare const AvgMetric: (key: any, field: any) => {};
export declare const SumMetric: (key: any, field: any) => {};
export interface TopHitsMetricOptions {
    size: number;
    from?: number;
    _source?: any;
    sort?: any;
    [prop: string]: any;
}
export declare function TopHitsMetric(key: any, top_hits: TopHitsMetricOptions): {};
export declare function GeoBoundsMetric(key: any, field: any, options?: {}): {};
