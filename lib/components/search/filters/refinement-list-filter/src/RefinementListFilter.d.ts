import FacetAccessor from "../../../../../domain/accessors/FacetAccessor.ts";
import SearchkitComponent from "../../../../SearchkitComponent.ts";
export interface IRefinementListFilter {
    field: string;
    operator?: string;
    size?: string;
    title: string;
}
export default class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
    accessor: FacetAccessor;
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    hasOptions(): boolean;
    render(): JSX.Element;
}
