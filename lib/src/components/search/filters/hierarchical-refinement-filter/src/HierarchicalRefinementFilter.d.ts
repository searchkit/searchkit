import { SearchkitComponent, NestedFacetAccessor, NestedFacetAccessorOptions } from "../../../../../core";
export interface IHierarchicalRefinementFilter extends NestedFacetAccessorOptions {
    mod?: string;
}
export declare class HierarchicalRefinementFilter extends SearchkitComponent<IHierarchicalRefinementFilter, any> {
    accessor: NestedFacetAccessor;
    constructor(props: IHierarchicalRefinementFilter);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): NestedFacetAccessor;
    addFilter(level: any, option: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): JSX.Element;
}
