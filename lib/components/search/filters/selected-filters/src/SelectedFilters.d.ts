import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export declare class SelectedFilters extends SearchkitComponent<any, any> {
    getFilters(): Array<any>;
    hasFilters(): boolean;
    renderFilter(filter: any): JSX.Element;
    removeFilter(value: any, facetAccessor: FacetAccessor): void;
    render(): JSX.Element;
}
