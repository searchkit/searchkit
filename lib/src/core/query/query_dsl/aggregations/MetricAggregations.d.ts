export declare function CardinalityMetric(key: any, field: any): {};
export declare function MinMetric(key: any, field: any): {};
export interface TopHitsMetricOptions {
    size: number;
    from?: number;
    _source?: any;
    sort?: any;
    [prop: string]: any;
}
export declare function TopHitsMetric(key: any, top_hits: TopHitsMetricOptions): {};
