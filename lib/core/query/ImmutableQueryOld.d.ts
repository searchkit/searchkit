export declare class ImmutableQuery {
    index: any;
    query: any;
    static defaultQuery: any;
    static defaultIndex: any;
    constructor(query?: any, index?: any);
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addQuery(query: any): ImmutableQuery;
    addHiddenFilter(bool: any): ImmutableQuery;
    addFilter(key: any, bool: any): ImmutableQuery;
    getFiltersArray(): any;
    setAggs(aggs: any): ImmutableQuery;
    getFilters(key?: any): {
        bool: {
            must: any;
        };
        $array: any;
    };
    setSize(size: number): ImmutableQuery;
    setSort(sort: string): ImmutableQuery;
    getSize(): any;
    setFrom(from: number): ImmutableQuery;
    getFrom(): any;
    update(updateDef: any, newIndex?: any): ImmutableQuery;
    static areQueriesDifferent(queryA: ImmutableQuery, queryB: ImmutableQuery): boolean;
    getJSON(): any;
}
