import { SearchkitComponent, SearchkitComponentProps, ViewOptionsAccessor, RenderComponentType } from "../../../core";
import { HitItemProps, HitsListProps } from "../../";
export interface ViewSwitcherConfigProps extends SearchkitComponentProps {
    hitComponents: Array<{
        key: string;
        title: string;
        itemComponent?: RenderComponentType<HitItemProps>;
        listComponent?: RenderComponentType<HitsListProps>;
        defaultOption?: boolean;
    }>;
}
export declare class ViewSwitcherConfig extends SearchkitComponent<ViewSwitcherConfigProps, any> {
    accessor: ViewOptionsAccessor;
    static propTypes: any;
    defineAccessor(): ViewOptionsAccessor;
    render(): any;
}
