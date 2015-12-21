import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export interface IRefinementListFilter {
    field: string;
    operator?: string;
    size?: string;
    title: string;
    id: string;
    mod?: string;
}
export declare class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): FacetAccessor;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    hasOptions(): boolean;
    render(): JSX.Element;
}
