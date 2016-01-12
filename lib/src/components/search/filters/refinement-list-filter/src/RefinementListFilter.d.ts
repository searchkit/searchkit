import { SearchkitComponent, FacetAccessor, ISizeOption } from "../../../../../core";
export interface IRefinementListFilter {
    field: string;
    operator?: string;
    size?: number;
    title: string;
    id: string;
    mod?: string;
}
export declare class RefinementListFilter extends SearchkitComponent<IRefinementListFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    constructor(props: any);
    defineAccessor(): FacetAccessor;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    addFilter(option: any): void;
    renderOption(option: any): JSX.Element;
    hasOptions(): boolean;
    toggleViewMoreOption(option: ISizeOption): void;
    renderShowMore(): JSX.Element;
    render(): JSX.Element;
}
