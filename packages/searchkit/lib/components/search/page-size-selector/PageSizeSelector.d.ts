import { SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../core";
import { Select, ListProps } from "../../ui";
export interface PageSizeSelectorProps extends SearchkitComponentProps {
    listComponent?: RenderComponentType<ListProps>;
    options: Array<Number>;
}
export declare class PageSizeSelector extends SearchkitComponent<PageSizeSelectorProps, any> {
    static defaultProps: {
        listComponent: typeof Select;
    };
    static propTypes: any;
    getPageSizeAccessor(): any;
    setSize(size: any): void;
    setItems(sizes: any): void;
    render(): React.ReactElement<any>;
}
