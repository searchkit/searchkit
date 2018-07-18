import * as React from "react";
import { SearchkitComponent, NestedFacetAccessor, SearchkitComponentProps, RenderComponentType } from "../../../../../core";
import { Panel, ItemComponent, ItemProps } from "../../../../ui";
export interface HierarchicalRefinementFilterProps extends SearchkitComponentProps {
    field: string;
    id: string;
    title: string;
    size?: number;
    orderKey?: string;
    orderDirection?: string;
    startLevel?: number;
    countFormatter?: (count: number) => number | string;
    containerComponent?: RenderComponentType<any>;
    itemComponent?: RenderComponentType<ItemProps>;
}
export declare class HierarchicalRefinementFilter extends SearchkitComponent<HierarchicalRefinementFilterProps, any> {
    accessor: NestedFacetAccessor;
    static defaultProps: {
        countFormatter: any;
        containerComponent: typeof Panel;
        itemComponent: typeof ItemComponent;
    };
    static propTypes: any;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    defineAccessor(): NestedFacetAccessor;
    addFilter(level: any, option: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): React.ReactElement<any>;
}
