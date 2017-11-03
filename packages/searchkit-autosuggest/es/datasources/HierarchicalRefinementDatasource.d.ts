import { NestedFacetAccessor, NestedFacetAccessorOptions, SearchkitManager } from "searchkit";
export declare type HierarchicalRefinementDatasourceOptions = {
    accessorId?: string;
} & NestedFacetAccessorOptions;
export declare class HierarchicalRefinementDatasource {
    options: HierarchicalRefinementDatasourceOptions;
    searchkit: SearchkitManager;
    originalAccessor: NestedFacetAccessor;
    delegateAccessor: NestedFacetAccessor;
    constructor(options: any);
    isSearchkitSource(): boolean;
    configure(searchkit: any): void;
    createDelegate(accessor: any): NestedFacetAccessor;
    search(query: any, queryString: any): any;
    onSelect(item: any): void;
    getGroupedResult(results: any): {
        title: any;
        onSelect: () => void;
        results: any;
    };
}
