import * as React from "react";
import { ListProps } from "./ListProps";
export declare class Select extends React.PureComponent<ListProps, any> {
    static defaultProps: any;
    constructor(props: any);
    onChange(e: any): void;
    getSelectedValue(): string;
    render(): JSX.Element;
}
