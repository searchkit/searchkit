import { QueryAccessor, SearchkitComponent, SearchkitComponentProps } from "../../../core";
export interface SearchBoxProps extends SearchkitComponentProps {
    searchOnChange?: boolean;
    searchThrottleTime?: number;
    queryFields?: Array<string>;
    queryBuilder?: Function;
    queryOptions?: any;
    autofocus?: boolean;
    id?: string;
    mod?: string;
    placeholder?: string;
    prefixQueryFields?: Array<string>;
    prefixQueryOptions?: Object;
    blurAction?: "search" | "restore";
}
export declare class SearchBox extends SearchkitComponent<SearchBoxProps, any> {
    accessor: QueryAccessor;
    lastSearchMs: number;
    throttledSearch: () => void;
    static translations: any;
    translations: any;
    static defaultProps: {
        id: string;
        mod: string;
        searchThrottleTime: number;
        blurAction: string;
    };
    static propTypes: any;
    constructor(props: SearchBoxProps);
    defineBEMBlocks(): {
        container: string;
    };
    defineAccessor(): QueryAccessor;
    onSubmit(event: any): void;
    searchQuery(query: any): void;
    getValue(): any;
    getAccessorValue(): string;
    onChange(e: any): void;
    setFocusState(focused: boolean): void;
    render(): JSX.Element;
}
