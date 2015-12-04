import { SearchAccessor, SearchkitComponent } from "../../../../core";
export interface ISearchBox {
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    constructor(props: ISearchBox);
    defineAccessor(): SearchAccessor;
    onSubmit(event: any): void;
    getValue(): string;
    onChange(event: any): void;
    render(): JSX.Element;
}
