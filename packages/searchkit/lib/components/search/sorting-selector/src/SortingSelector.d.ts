import { SearchkitComponent, SortingAccessor, SearchkitComponentProps, SortingOption, RenderComponentType } from "../../../../core";
import { Select, ListProps } from "../../../ui";
export interface SortingProps extends SearchkitComponentProps {
    options: Array<SortingOption>;
    listComponent?: RenderComponentType<ListProps>;
}
export declare class SortingSelector extends SearchkitComponent<SortingProps, any> {
    accessor: SortingAccessor;
    static propTypes: any;
    static defaultProps: {
        listComponent: typeof Select;
    };
    defineAccessor(): SortingAccessor;
    toggleItem(key: any): void;
    setItems(keys: any): void;
    render(): React.ReactElement<any>;
}
