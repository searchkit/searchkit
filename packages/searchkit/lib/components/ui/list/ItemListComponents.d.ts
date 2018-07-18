import * as React from "react";
import { ListProps } from "./ListProps";
export interface ItemListProps extends ListProps {
    itemComponent?: any;
}
export declare class AbstractItemList extends React.PureComponent<ItemListProps, {}> {
    static defaultProps: any;
    isActive(option: any): any;
    render(): JSX.Element;
}
export declare class ItemList extends AbstractItemList {
    static defaultProps: any;
}
export declare class CheckboxItemList extends AbstractItemList {
    static defaultProps: any;
}
export declare class Toggle extends AbstractItemList {
    static defaultProps: any;
}
export declare class Tabs extends AbstractItemList {
    static defaultProps: any;
}
