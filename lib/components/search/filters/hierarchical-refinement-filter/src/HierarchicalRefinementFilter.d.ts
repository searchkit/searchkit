import { SearchkitComponent, NestedFacetAccessor } from "../../../../../core";
export interface IHierarchicalRefinementFilter {
    id: string;
    field: string;
    title: string;
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
