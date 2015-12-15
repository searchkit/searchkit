import { SearchkitComponent, SortingAccessor } from "../../../../core";
export interface ISortingSelector {
    options: [{
        label: string;
        field: string;
        order: string;
    }];
}
export declare class SortingSelector extends SearchkitComponent<ISortingSelector, any> {
    accessor: SortingAccessor;
    defineAccessor(): SortingAccessor;
    renderOption(option: any): JSX.Element;
    updateSorting(e: any): void;
    getSelectedValue(): string;
    render(): JSX.Element;
}
