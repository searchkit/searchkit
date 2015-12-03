export default class RootBuilder {
    $$filters: {};
    filter: any;
    aggs: any;
    query: any;
    size: number;
    from: number;
    constructor();
    setQuery(query: any): void;
    setSize(size: number): void;
    setFrom(from: number): void;
    addFilter(key: any, bool: any): RootBuilder;
    getFilters(key?: any): {
        bool: {
            must: {}[];
        };
    };
    setAggs(key: any, aggs: any): void;
    getJSON(): any;
}
