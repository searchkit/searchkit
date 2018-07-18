import * as React from "react";
import { SearchkitComponent, HierarchicalFacetAccessor, SearchkitComponentProps, RenderComponentType } from "../../../../../core";
import { Panel, ItemComponent, ItemProps } from "../../../../ui";
export interface HierarchicalMenuFilterProps extends SearchkitComponentProps {
    id: string;
    fields: Array<string>;
    title: string;
    size?: number;
    orderKey?: string;
    orderDirection?: string;
    countFormatter?: (count: number) => string | number;
    containerComponent?: RenderComponentType<any>;
    itemComponent?: RenderComponentType<ItemProps>;
}
export declare class HierarchicalMenuFilter extends SearchkitComponent<HierarchicalMenuFilterProps, any> {
    accessor: HierarchicalFacetAccessor;
    static defaultProps: {
        countFormatter: any;
        size: number;
        containerComponent: typeof Panel;
        itemComponent: typeof ItemComponent;
    };
    static propTypes: any;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    defineAccessor(): HierarchicalFacetAccessor;
    addFilter(option: any, level: any): void;
    renderOption(level: any, option: any): JSX.Element;
    renderOptions(level: any): JSX.Element;
    render(): React.ReactElement<any>;
}
