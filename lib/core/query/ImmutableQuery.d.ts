import { SelectedFilter } from "./SelectedFilter";
export declare class ImmutableQuery {
    index: any;
    query: any;
    static defaultIndex: any;
    constructor(index?: any);
    buildQuery(): void;
    hasFilters(): boolean;
    hasFiltersOrQuery(): boolean;
    addQuery(query: any): ImmutableQuery;
    addSelectedFilter(selectedFilter: SelectedFilter): ImmutableQuery;
    addSelectedFilters(selectedFilters: Array<SelectedFilter>): ImmutableQuery;
    getSelectedFilters(): any;
    addAnonymousFilter(bool: any): ImmutableQuery;
    addFilter(key: any, filter: any): ImmutableQuery;
    setAggs(aggs: any): ImmutableQuery;
    getFilters(keys: any): any;
    _getFilters(keys: any, method: any): any;
    getFiltersWithKeys(keys: any): any;
    getFiltersWithoutKeys(keys: any): any;
    setSize(size: number): ImmutableQuery;
    setSort(sort: string): ImmutableQuery;
    getSize(): any;
    setFrom(from: number): ImmutableQuery;
    getFrom(): any;
    update(updateDef: any): ImmutableQuery;
    getJSON(): any;
}
