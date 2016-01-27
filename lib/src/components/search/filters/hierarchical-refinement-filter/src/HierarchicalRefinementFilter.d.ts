import { SearchkitComponent, NestedFacetAccessor, SearchkitComponentProps } from "../../../../../core";
export interface HierarchicalRefinementFilterProps extends SearchkitComponentProps {
    field: string;
    id: string;
    title: string;
    orderKey?: string;
    orderDirection?: string;
    startLevel?: number;
}
export declare class HierarchicalRefinementFilter extends SearchkitComponent<HierarchicalRefinementFilterProps, any> {
    accessor: NestedFacetAccessor;
    static propTypes: any;
    constructor(props: HierarchicalRefinementFilterProps);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    defineAccessor(): NestedFacetAccessor;
    addFilter(level: any, option: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): JSX.Element;
}
