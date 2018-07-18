import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface TagFilterProps extends SearchkitComponentProps {
    field: string;
    value: string;
}
export declare class TagFilter extends SearchkitComponent<TagFilterProps, any> {
    constructor();
    isActive(): any;
    handleClick(): void;
    render(): JSX.Element;
}
