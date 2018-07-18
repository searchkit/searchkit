import * as React from "react";
export interface PanelProps extends React.Props<Panel> {
    key?: any;
    title?: string;
    mod?: string;
    disabled?: boolean;
    className?: string;
    collapsable?: boolean;
    defaultCollapsed?: boolean;
}
export declare class Panel extends React.PureComponent<PanelProps, {
    collapsed: boolean;
}> {
    static propTypes: {
        title: any;
        disabled: any;
        mod: any;
        className: any;
        collapsable: any;
        defaultCollapsed: any;
    };
    static defaultProps: {
        disabled: boolean;
        collapsable: boolean;
        defaultCollapsed: boolean;
        mod: string;
    };
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    toggleCollapsed(): void;
    render(): JSX.Element;
}
