import { SearchkitComponent, FacetAccessor, ISizeOption, SearchkitComponentProps } from "../../../../../core";
export interface RefinementListFilterProps extends SearchkitComponentProps {
    field: string;
    operator?: string;
    size?: number;
    title: string;
    id: string;
    collapsible?: boolean;
    collapsed?: boolean;
}
export declare class RefinementListFilter extends SearchkitComponent<RefinementListFilterProps, any> {
    accessor: FacetAccessor;
    translations: {
        "View more": string;
        "View less": string;
        "View all": string;
    };
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
    toggleCollapse(): void;
    componentWillUpdate(props: any, state: any): void;
    render(): JSX.Element;
}
