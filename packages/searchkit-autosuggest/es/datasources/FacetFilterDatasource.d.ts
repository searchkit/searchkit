import { FacetAccessor, SearchkitManager, FacetAccessorOptions } from "searchkit";
export declare type FacetFilterDatasourceOptions = {
    accessorId?: string;
} & FacetAccessorOptions;
export declare class FacetFilterDatasource {
    options: FacetFilterDatasourceOptions;
    searchkit: SearchkitManager;
    originalAccessor: FacetAccessor;
    delegateAccessor: FacetAccessor;
    constructor(options: any);
    isSearchkitSource(): boolean;
    configure(searchkit: any): void;
    createDelegate(accessor: any): FacetAccessor;
    search(query: any, queryString: any): any;
    onSelect: (key: any) => string;
    getGroupedResult(results: any): {
        id: any;
        title: any;
        results: any[];
        onSelect: (key: any) => string;
    };
}
