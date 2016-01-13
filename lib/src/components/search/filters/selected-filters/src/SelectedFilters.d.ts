import { SearchkitComponent, SearchkitComponentProps } from "../../../../../core";
export interface SelectedFiltersProps extends SearchkitComponentProps {
}
export declare class SelectedFilters extends SearchkitComponent<SelectedFiltersProps, any> {
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    getFilters(): Array<any>;
    hasFilters(): boolean;
    renderFilter(filter: any): JSX.Element;
    removeFilter(filter: any): void;
    render(): JSX.Element;
}
