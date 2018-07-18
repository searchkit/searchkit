import * as React from 'react';
export interface FilterGroupItemProps {
    key: string;
    itemKey: string;
    bemBlocks?: any;
    label: string;
    filter: any;
    removeFilter: Function;
}
export declare class FilterGroupItem extends React.PureComponent<FilterGroupItemProps, any> {
    constructor(props: any);
    removeFilter(): void;
    render(): JSX.Element;
}
export interface FilterGroupProps {
    mod?: string;
    className?: string;
    title: string;
    filters: Array<any>;
    translate?: Function;
    removeFilter: Function;
    removeFilters: Function;
}
export declare class FilterGroup extends React.Component<FilterGroupProps, any> {
    constructor(props: any);
    static defaultProps: {
        mod: string;
        translate: (str: any) => any;
    };
    removeFilters(): void;
    render(): JSX.Element;
    renderFilter(filter: any, bemBlocks: any): JSX.Element;
    renderRemove(bemBlocks: any): JSX.Element;
}
