import { SearchkitComponent, SortingAccessor, SearchkitComponentProps, SortingOption } from "../../../../core";
export interface SortingProps extends SearchkitComponentProps {
    options: Array<SortingOption>;
}
export declare class SortingSelector extends SearchkitComponent<SortingProps, any> {
    accessor: SortingAccessor;
    static propTypes: any;
    defineAccessor(): SortingAccessor;
    defineBEMBlocks(): {
        container: string;
    };
    renderOption(option: any): JSX.Element;
    updateSorting(e: any): void;
    getSelectedValue(): string;
    render(): JSX.Element;
}
