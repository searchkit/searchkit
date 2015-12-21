import { SearchkitComponent, HierarchicalFacetAccessor } from "../../../../../core";
export interface IHierarchicalMenuFilter {
    id: string;
    fields: Array<string>;
    title: string;
    mod?: string;
}
export declare class HierarchicalMenuFilter extends SearchkitComponent<IHierarchicalMenuFilter, any> {
    accessor: HierarchicalFacetAccessor;
    constructor(props: IHierarchicalMenuFilter);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): HierarchicalFacetAccessor;
    addFilter(option: any, level: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): JSX.Element;
}
