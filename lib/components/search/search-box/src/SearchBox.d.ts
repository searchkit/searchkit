import SimpleQueryAccessor from "../../../../domain/accessors/SimpleQueryAccessor.ts";
import SearchkitComponent from "../../../SearchkitComponent.ts";
export interface ISearchBox {
}
export default class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SimpleQueryAccessor;
    constructor(props: ISearchBox);
    defineAccessor(): SimpleQueryAccessor;
    onSubmit(event: any): void;
    getValue(): any;
    onChange(event: any): void;
    renderAutocomplete(): JSX.Element;
    render(): JSX.Element;
}
