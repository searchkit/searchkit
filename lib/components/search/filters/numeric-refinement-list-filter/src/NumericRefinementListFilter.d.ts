import { SearchkitComponent, NumericOptionsAccessor } from "../../../../../core";
export interface INumericRefinementListFilter {
    field: string;
    title: string;
    options: [{
        title: string;
        from?: number;
        to?: number;
    }];
    id: string;
}
export declare class NumericRefinementListFilter extends SearchkitComponent<INumericRefinementListFilter, any> {
    accessor: NumericOptionsAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): NumericOptionsAccessor;
    addFilter(option: any): void;
    isSelected(option: any): boolean;
    renderOption(option: any): JSX.Element;
    render(): JSX.Element;
}
