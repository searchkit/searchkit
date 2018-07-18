import * as React from "react";
import { ItemProps } from './ListProps';
export interface ItemComponentProps extends ItemProps {
    showCheckbox: boolean;
}
export declare class ItemComponent extends React.PureComponent<ItemComponentProps, any> {
    static defaultProps: {
        showCount: boolean;
        showCheckbox: boolean;
    };
    render(): JSX.Element;
}
export declare class CheckboxItemComponent extends React.PureComponent<ItemComponentProps, any> {
    static defaultProps: {
        showCount: boolean;
        showCheckbox: boolean;
    };
    render(): JSX.Element;
}
