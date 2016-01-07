import { SearchkitComponent, Accessor, LevelState } from "../../../../../core";
export interface PathFacetAccessorOptions {
    field: string;
    id: string;
    title: string;
}
export declare class PathFacetAccessor extends Accessor<LevelState> {
    state: LevelState;
    options: any;
    constructor(key: any, options: PathFacetAccessorOptions);
    getBuckets(path: any): any[];
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
}
export interface IHierarchicalRefinementFilter {
    id: string;
    field: string;
    title: string;
    mod?: string;
}
export declare class HierarchicalRefinementFilter extends SearchkitComponent<IHierarchicalRefinementFilter, any> {
    accessor: PathFacetAccessor;
    constructor(props: IHierarchicalRefinementFilter);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): PathFacetAccessor;
    addFilter(level: any, option: any): void;
    renderOption(path: any, level: any, option: any): JSX.Element;
    renderOptions(path: any, level: any): JSX.Element;
    render(): JSX.Element;
}
