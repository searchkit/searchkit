import FacetAccessor from "../../../../../domain/accessors/FacetAccessor";
import SearchkitComponent from "../../../../SearchkitComponent";
export interface IMenuFilter {
    field: string;
    title: string;
}
export default class MenuFilter extends SearchkitComponent<IMenuFilter, any> {
    accessor: FacetAccessor;
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    renderAllOption(): JSX.Element;
    render(): JSX.Element;
}
