import * as React from "react";
import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export interface IMenuFilter extends React.Props<any> {
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
