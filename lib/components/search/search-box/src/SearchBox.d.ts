import { SearchAccessor, SearchkitComponent } from "../../../../core";
export interface ISearchBox {
    searchOnChange?: boolean;
    prefixQueryFields?: Array<string>;
    queryFields?: Array<string>;
    mod?: string;
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    constructor(props: ISearchBox);
    componentWillMount(): void;
    defineBEMBlocks(): {
        container: string;
    };
    defineAccessor(): SearchAccessor;
    onSubmit(event: any): void;
    searchQuery(query: any): void;
    getValue(): string;
    onChange(e: any): void;
    setFocusState(focused: boolean): void;
    render(): JSX.Element;
}
