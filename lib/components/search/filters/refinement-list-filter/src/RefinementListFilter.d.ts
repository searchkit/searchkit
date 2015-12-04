import FacetAccessor from "../../../../../domain/new/accessors/FacetAccessor";
import SearchkitComponent from "../../../../../domain/new/SearchkitComponent";
export interface IRefinementListFilter {
    field: string;
    operator?: string;
    size?: string;
    title: string;
}
export default class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    hasOptions(): boolean;
    render(): JSX.Element;
}
