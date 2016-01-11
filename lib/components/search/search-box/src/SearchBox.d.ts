import { SearchAccessor, SearchkitComponent } from "../../../../core";
export interface ISearchBox {
    searchOnChange?: boolean;
    queryFields?: Array<string>;
    mod?: string;
    autofocus?: boolean;
    queryOptions?: any;
    prefixQueryFields?: Array<string>;
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    lastSearchMs: number;
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
