import { SearchkitComponent, ViewOptionsAccessor, RenderComponentType } from "../../../core";
import { HitsProps, HitItemProps, HitsListProps } from "../../";
export interface ViewSwitcherHitsProps extends HitsProps {
    hitComponents?: Array<{
        key: string;
        title: string;
        itemComponent?: RenderComponentType<HitItemProps>;
        listComponent?: RenderComponentType<HitsListProps>;
        defaultOption?: boolean;
    }>;
}
export declare class ViewSwitcherHits extends SearchkitComponent<ViewSwitcherHitsProps, any> {
    accessor: ViewOptionsAccessor;
    static propTypes: any;
    defineAccessor(): ViewOptionsAccessor;
    render(): JSX.Element;
}
