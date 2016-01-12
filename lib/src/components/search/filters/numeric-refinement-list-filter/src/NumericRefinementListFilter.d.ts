import { SearchkitComponent, NumericOptionsAccessor, NumericOptions } from "../../../../../core";
export declare class NumericRefinementListFilter extends SearchkitComponent<NumericOptions, any> {
    accessor: NumericOptionsAccessor;
    shouldCreateNewSearcher(): boolean;
    defineAccessor(): NumericOptionsAccessor;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    addFilter(option: any): void;
    isSelected(option: any): boolean;
    renderOption(option: any): JSX.Element;
    render(): JSX.Element;
}
