import { SearchkitComponent, SearchkitComponentProps, FacetAccessor } from "../../../../core";
export interface TagFilterConfigProps extends SearchkitComponentProps {
    field: string;
    title: string;
    id: string;
    operator?: string;
}
export declare class TagFilterConfig extends SearchkitComponent<TagFilterConfigProps, {}> {
    accessor: FacetAccessor;
    defineAccessor(): FacetAccessor;
    componentDidUpdate(prevProps: any): void;
    render(): any;
}
