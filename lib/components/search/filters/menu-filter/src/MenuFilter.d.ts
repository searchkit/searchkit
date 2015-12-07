import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export interface IMenuFilter {
    field: string;
    title: string;
}
export declare class MenuFilter extends SearchkitComponent<IMenuFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    renderAllOption(): JSX.Element;
    render(): JSX.Element;
}
