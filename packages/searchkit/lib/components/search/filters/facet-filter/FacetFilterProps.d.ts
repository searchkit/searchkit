import { SearchkitComponentProps, RenderComponentType, FieldOptions } from "../../../../core";
import { ItemProps, ListProps } from "../../../";
export interface FacetFilterProps extends SearchkitComponentProps {
    field: string;
    operator?: string;
    size?: number;
    title: string;
    id: string;
    containerComponent?: RenderComponentType<any>;
    itemComponent?: RenderComponentType<ItemProps>;
    listComponent?: RenderComponentType<ListProps>;
    orderKey?: string;
    orderDirection?: string;
    include?: Array<string> | string;
    exclude?: Array<string> | string;
    showCount?: boolean;
    showMore?: boolean;
    fieldOptions?: FieldOptions;
    countFormatter?: (count: number) => number | string;
    bucketsTransform?: Function;
}
export declare const FacetFilterPropTypes: any;
