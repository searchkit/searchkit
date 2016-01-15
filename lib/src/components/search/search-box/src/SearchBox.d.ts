import { QueryAccessor, SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface SearchBoxProps extends SearchkitComponentProps {
    searchOnChange?: boolean;
    queryFields?: Array<string>;
    autofocus?: boolean;
    queryOptions?: any;
    prefixQueryFields?: Array<string>;
}
export declare class SearchBox extends SearchkitComponent<SearchBoxProps, any> {
    accessor: QueryAccessor;
    lastSearchMs: number;
    static translations: any;
    translations: any;
    static propTypes: {};
    constructor(props: SearchBoxProps);
    componentWillMount(): void;
    defineBEMBlocks(): {
        container: string;
    };
    defineAccessor(): QueryAccessor;
    onSubmit(event: any): void;
    searchQuery(query: any): void;
    getValue(): string;
    onChange(e: any): void;
    setFocusState(focused: boolean): void;
    render(): JSX.Element;
}
