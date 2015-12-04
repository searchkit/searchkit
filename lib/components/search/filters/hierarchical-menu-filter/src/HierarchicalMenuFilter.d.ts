import { SearchkitComponent, HierarchicalFacetAccessor } from "../../../../../core";
export interface IHierarchicalMenuFilter {
    fields: Array<string>;
    title: string;
}
export declare class HierarchicalMenuFilter extends SearchkitComponent<IHierarchicalMenuFilter, any> {
    accessors: HierarchicalFacetAccessor;
    constructor(props: IHierarchicalMenuFilter);
    componentWillMount(): void;
    createAccessors(): void;
    addFilter(accessor: any, option: any): void;
    private getLevelAccessor(level);
    renderOption(level: any, option: any): JSX.Element;
    hasOptions(): boolean;
    renderOptions(level: any): JSX.Element;
    render(): JSX.Element;
    render2(): JSX.Element;
}
