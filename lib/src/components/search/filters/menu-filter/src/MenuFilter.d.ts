import { SearchkitComponent, FacetAccessor, SearchkitComponentProps } from "../../../../../core";
export interface MenuFilterProps extends SearchkitComponentProps {
    field: string;
    title: string;
    id: string;
    size?: number;
}
export declare class MenuFilter extends SearchkitComponent<MenuFilterProps, any> {
    accessor: FacetAccessor;
    static propTypes: {};
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
