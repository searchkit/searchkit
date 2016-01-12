import { SearchkitComponent, FacetAccessor } from "../../../../../core";
export interface IMenuFilter {
    field: string;
    title: string;
    id: string;
    mod?: string;
    size?: number;
}
export declare class MenuFilter extends SearchkitComponent<IMenuFilter, any> {
    accessor: FacetAccessor;
    shouldCreateNewSearcher(): boolean;
    defineBEMBlocks(): {
        container: string;
        option: string;
    };
    defineAccessor(): FacetAccessor;
    addFilter(option: any): void;
    renderOption(label: any, count: any, isChecked: any): JSX.Element;
    createOption(option: any): JSX.Element;
    render(): JSX.Element;
}
