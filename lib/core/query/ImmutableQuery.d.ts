export declare class ImmutableQuery {
    index: any;
    query: any;
    static defaultQuery: any;
    static defaultIndex: any;
    constructor(query?: any, index?: any);
    hasFilters(): boolean;
    addQuery(query: any): ImmutableQuery;
    addFilter(key: any, bool: any): ImmutableQuery;
    getFiltersArray(): any;
    setAggs(aggs: any): ImmutableQuery;
    getFilters(key?: any): {
        bool: {
            must: any;
        };
    };
    setSize(size: number): ImmutableQuery;
    setFrom(from: number): ImmutableQuery;
    update(updateDef: any, newIndex?: any): ImmutableQuery;
    static areQueriesDifferent(queryA: ImmutableQuery, queryB: ImmutableQuery): boolean;
    getJSON(): any;
}
