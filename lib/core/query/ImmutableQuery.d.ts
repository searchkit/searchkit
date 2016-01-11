import { SelectedFilter } from "./SelectedFilter";
export declare class ImmutableQuery {
    index: any;
    query: any;
    static defaultQuery: any;
    static defaultIndex: any;
    constructor(query?: any, index?: any);
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addQuery(query: any): ImmutableQuery;
    addSelectedFilter(selectedFilter: SelectedFilter): ImmutableQuery;
    addSelectedFilters(selectedFilters: Array<SelectedFilter>): ImmutableQuery;
    getSelectedFilters(): any;
    addAnonymousFilter(bool: any): ImmutableQuery;
    addFilter(key: any, bool: any): ImmutableQuery;
    setAggs(aggs: any): ImmutableQuery;
    getFilters(keys: any): {
        bool: {
            must: any;
        };
    };
    _getFilters(keys: any, method: any): {
        bool: {
            must: any;
        };
    };
    getFiltersWithKeys(keys: any): {
        bool: {
            must: any;
        };
    };
    getFiltersWithoutKeys(keys: any): {
        bool: {
            must: any;
        };
    };
    setSize(size: number): ImmutableQuery;
    setSort(sort: string): ImmutableQuery;
    getSize(): any;
    setFrom(from: number): ImmutableQuery;
    getFrom(): any;
    update(updateDef: any, newIndex?: any): ImmutableQuery;
    getJSON(): any;
}
