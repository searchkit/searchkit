import * as React from "react";
import { AbstractItemList } from "./ItemListComponents";
import { ItemProps } from './ListProps';
export interface ItemHistogramComponentProps extends ItemProps {
    showCheckbox: boolean;
}
export declare class ItemHistogramComponent extends React.PureComponent<ItemHistogramComponentProps, {}> {
    getCountRatio(): number;
    render(): JSX.Element;
}
export declare class ItemHistogramList extends AbstractItemList {
    static defaultProps: any;
}
