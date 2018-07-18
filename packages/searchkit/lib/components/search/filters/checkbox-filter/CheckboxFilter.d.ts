import { SearchkitComponent, SearchkitComponentProps, CheckboxFilterAccessor, RenderComponentType } from "../../../../core";
import { Panel, CheckboxItemList } from "../../../ui";
export interface CheckboxFilterProps extends SearchkitComponentProps {
    id: string;
    filter: any;
    title: string;
    label: string;
    containerComponent?: RenderComponentType<any>;
    listComponent?: RenderComponentType<any>;
    showCount?: boolean;
}
export declare class CheckboxFilter extends SearchkitComponent<CheckboxFilterProps, any> {
    accessor: CheckboxFilterAccessor;
    static propTypes: any;
    static defaultProps: {
        listComponent: typeof CheckboxItemList;
        containerComponent: typeof Panel;
        collapsable: boolean;
        showCount: boolean;
    };
    constructor(props: any);
    defineAccessor(): CheckboxFilterAccessor;
    toggleFilter(): void;
    setFilters(keys: any): void;
    getSelectedItems(): string[];
    render(): React.ReactElement<any>;
}
