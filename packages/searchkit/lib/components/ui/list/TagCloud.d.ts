import * as React from "react";
import { RenderComponentType } from "../../../core/react";
import { ListProps, ItemProps } from './ListProps';
export interface TagCloudProps extends ListProps {
    minFontSize?: number;
    maxFontSize?: number;
    itemComponent?: RenderComponentType<ItemProps>;
}
export declare class TagCloud extends React.PureComponent<TagCloudProps, any> {
    static defaultProps: any;
    render(): JSX.Element;
    renderItem(item: any, bemBlocks: any, min: any, max: any): React.ReactElement<any>;
}
