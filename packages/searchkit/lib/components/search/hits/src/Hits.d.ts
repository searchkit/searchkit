import * as React from "react";
import { SearchkitComponent, SearchkitComponentProps, SourceFilterType, HitsAccessor, RenderComponentType } from "../../../../core";
export interface HitItemProps {
    key: string;
    bemBlocks?: any;
    result: any;
}
export declare class HitItem extends React.PureComponent<HitItemProps, any> {
    render(): JSX.Element;
}
export interface HitsListProps {
    mod?: string;
    className?: string;
    itemComponent?: RenderComponentType<HitItemProps>;
    hits: Array<Object>;
}
export declare class HitsList extends React.PureComponent<HitsListProps, any> {
    static defaultProps: {
        mod: string;
        itemComponent: typeof HitItem;
    };
    static propTypes: {
        mod: any;
        className: any;
        itemComponent: any;
        hits: any;
    };
    render(): JSX.Element;
}
export interface HitsProps extends SearchkitComponentProps {
    hitsPerPage?: number;
    highlightFields?: Array<string>;
    customHighlight?: any;
    sourceFilter?: SourceFilterType;
    itemComponent?: RenderComponentType<HitItemProps>;
    listComponent?: RenderComponentType<HitsListProps>;
    scrollTo?: boolean | string;
}
export declare class Hits extends SearchkitComponent<HitsProps, any> {
    hitsAccessor: HitsAccessor;
    static propTypes: any;
    static defaultProps: {
        listComponent: typeof HitsList;
        scrollTo: string;
    };
    componentDidMount(): void;
    render(): React.ReactElement<any>;
}
