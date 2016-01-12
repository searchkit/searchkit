import { SearchkitComponent } from "../../../../../core";
export interface ISelectedFilters {
    mod?: string;
}
export declare class SelectedFilters extends SearchkitComponent<ISelectedFilters, any> {
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
