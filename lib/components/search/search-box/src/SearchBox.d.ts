import SimpleQueryAccessor from "../../../../domain/new/accessors/SearchAccessor";
import SearchkitComponent from "../../../../domain/new/SearchkitComponent";
export interface ISearchBox {
}
export default class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SimpleQueryAccessor;
    constructor(props: ISearchBox);
    defineAccessor(): SimpleQueryAccessor;
    onSubmit(event: any): void;
    getValue(): string;
    onChange(event: any): void;
    render(): JSX.Element;
}
