import { SearchkitComponent, NumericOptionsAccessor, SearchkitComponentProps, RangeOption } from "../../../../../core";
export interface NumericRefinementListFilterProps extends SearchkitComponentProps {
    field: string;
    title: string;
    options: Array<RangeOption>;
    id: string;
}
export declare class NumericRefinementListFilter extends SearchkitComponent<NumericRefinementListFilterProps, any> {
    accessor: NumericOptionsAccessor;
    static propTypes: {};
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
