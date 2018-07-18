import { SearchkitComponent, SearchkitComponentProps, RenderComponentType, SelectedFilter } from "../../../../core";
import { FilterGroup } from "../../../ui";
export interface GroupedSelectedFiltersProps extends SearchkitComponentProps {
    groupComponent?: RenderComponentType<any>;
}
export declare class GroupedSelectedFilters extends SearchkitComponent<GroupedSelectedFiltersProps, any> {
    bemBlocks: {
        container: Function;
    };
    static propTypes: any;
    static defaultProps: {
        groupComponent: typeof FilterGroup;
    };
    constructor(props: any);
    defineBEMBlocks(): {
        container: string;
    };
    getFilters(): SelectedFilter[];
    getGroupedFilters(): Array<any>;
    hasFilters(): boolean;
    removeFilter(filter: any): void;
    removeFilters(filters: Array<SelectedFilter>): void;
    render(): JSX.Element;
}
