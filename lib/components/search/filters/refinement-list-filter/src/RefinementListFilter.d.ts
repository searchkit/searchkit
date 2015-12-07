import * as React from "react";
import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export interface IRefinementListFilter extends React.Props<any> {
    field: string;
    operator?: string;
    size?: string;
    title: string;
}
export declare class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    hasOptions(): boolean;
    render(): JSX.Element;
}
