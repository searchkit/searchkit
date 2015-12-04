import { SearchkitComponent } from "../../../../../core";
export declare class SelectedFilters extends SearchkitComponent<any, any> {
    getFilters(): Array<any>;
    hasFilters(): boolean;
    renderFilter(filter: any): JSX.Element;
    removeFilter(filter: any): void;
    render(): JSX.Element;
}
