import { SearchkitComponent, NumericOptionsAccessor, SearchkitComponentProps, RangeOption, RenderComponentType, FieldOptions } from "../../../../../core";
import { ListProps, ItemProps, ItemList, Panel } from "../../../../ui";
export interface NumericRefinementListFilterProps extends SearchkitComponentProps {
    field: string;
    title: string;
    options: Array<RangeOption>;
    id: string;
    multiselect?: boolean;
    showCount?: boolean;
    listComponent?: RenderComponentType<ListProps>;
    itemComponent?: RenderComponentType<ItemProps>;
    containerComponent?: RenderComponentType<any>;
    fieldOptions?: FieldOptions;
    countFormatter?: (count: number) => number | string;
}
export declare class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
    accessor: NumericOptionsAccessor;
    static propTypes: any;
    static defaultProps: {
        listComponent: typeof ItemList;
        containerComponent: typeof Panel;
        multiselect: boolean;
        showCount: boolean;
    };
    constructor(props: any);
    defineAccessor(): NumericOptionsAccessor;
    toggleItem(key: any): void;
    setItems(keys: any): void;
    getSelectedItems(): any;
    hasOptions(): boolean;
    render(): React.ReactElement<any>;
}
