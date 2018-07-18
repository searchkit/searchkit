import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps, RenderComponentType, ResetSearchOptions, ResetSearchAccessor } from "../../../../../core";
export interface ResetFiltersDisplayProps {
    bemBlock: any;
    hasFilters: boolean;
    resetFilters: Function;
    clearAllLabel: string;
    translate: Function;
}
export declare class ResetFiltersDisplay extends React.PureComponent<ResetFiltersDisplayProps, any> {
    render(): JSX.Element;
}
export interface ResetFiltersProps extends SearchkitComponentProps {
    component?: RenderComponentType<ResetFiltersDisplayProps>;
    options?: ResetSearchOptions;
}
export declare class ResetFilters extends SearchkitComponent<ResetFiltersProps, any> {
    static translations: any;
    translations: any;
    accessor: ResetSearchAccessor;
    static propTypes: any;
    static defaultProps: {
        component: typeof ResetFiltersDisplay;
    };
    constructor(props: any);
    defineBEMBlocks(): {
        container: string;
    };
    defineAccessor(): ResetSearchAccessor;
    resetFilters(): void;
    render(): React.ReactElement<any>;
}
