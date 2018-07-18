import { SearchkitComponent, SearchkitComponentProps, RenderComponentType } from "../../../core";
import { Toggle, ListProps } from "../../ui";
export interface ViewSwitcherProps extends SearchkitComponentProps {
    listComponent?: RenderComponentType<ListProps>;
}
export declare class ViewSwitcherToggle extends SearchkitComponent<ViewSwitcherProps, any> {
    static defaultProps: {
        listComponent: typeof Toggle;
    };
    static propTypes: any;
    getViewOptionsSwitcherAccessor(): any;
    setView(view: any): void;
    render(): React.ReactElement<any>;
}
