import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../../core";
export declare class FilterItem extends React.PureComponent<FilterItemProps, any> {
    render(): JSX.Element;
}
export interface FilterItemProps {
    key: string;
    bemBlocks?: any;
    filterId: string;
    labelKey: string;
    labelValue: string;
    removeFilter: Function;
    translate: Function;
}
export interface SelectedFiltersProps extends SearchkitComponentProps {
    itemComponent?: RenderComponentType<FilterItemProps>;
}
export declare class SelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {
    static propTypes: any;
    static defaultProps: {
        itemComponent: typeof FilterItem;
    };
    constructor(props: any);
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    getFilters(): Array<any>;
    hasFilters(): boolean;
    renderFilter(filter: any): React.ReactElement<any>;
    removeFilter(filter: any): void;
    render(): JSX.Element;
}
