import { SearchkitComponent, FacetAccessor, ISizeOption, SearchkitComponentProps } from "../../../../../core";
export interface RefinementListFilterProps extends SearchkitComponentProps {
    field: string;
    operator?: string;
    size?: number;
    title: string;
    id: string;
}
export declare class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
    accessor: FacetAccessor;
    static propTypes: any;
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
