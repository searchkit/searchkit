import FacetAccessor from "../../../../../domain/accessors/FacetAccessor.ts";
import SearchkitComponent from "../../../../SearchkitComponent.ts";
export default class SelectedFilters extends SearchkitComponent<any, any> {
    getFilters(): Array<any>;
    hasFilters(): boolean;
    renderFilter(filter: any): JSX.Element;
    removeFilter(value: any, facetAccessor: FacetAccessor): void;
    render(): JSX.Element;
}
