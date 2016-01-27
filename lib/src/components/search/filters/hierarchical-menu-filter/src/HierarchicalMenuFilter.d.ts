import { SearchkitComponent, HierarchicalFacetAccessor, SearchkitComponentProps } from "../../../../../core";
export interface HierarchicalMenuFilterProps extends SearchkitComponentProps {
    id: string;
    fields: Array<string>;
    title: string;
}
export declare class HierarchicalMenuFilter extends SearchkitComponent<HierarchicalMenuFilterProps, any> {
    accessor: HierarchicalFacetAccessor;
    static propTypes: any;
    constructor(props: HierarchicalMenuFilterProps);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    defineAccessor(): HierarchicalFacetAccessor;
    addFilter(option: any, level: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): JSX.Element;
}
