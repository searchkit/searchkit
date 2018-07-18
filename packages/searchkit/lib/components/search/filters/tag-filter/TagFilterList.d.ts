import * as React from "react";
import { SearchkitComponentProps } from "../../../../core";
export interface TagFilterListProps extends SearchkitComponentProps {
    field: string;
    values: [string];
    children?: React.ReactChildren;
}
export declare class TagFilterList extends React.Component<TagFilterListProps, any> {
    render(): JSX.Element;
}
