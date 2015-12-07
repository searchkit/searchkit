import { SearchAccessor, SearchkitComponent, ESRequest } from "../../../../core";
export interface ISearchBox {
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    suggestSearcher: ESRequest;
    value: string;
    constructor(props: ISearchBox);
    createSuggestSearcher(): void;
    defineAccessor(): SearchAccessor;
    onSubmit(event: any): void;
    processSuggestions(results: any): any[];
    querySuggestions(query: any, callback: any): void;
    suggestionRenderer(suggestion: any, input: any): JSX.Element;
    getValue(): string;
    onChange(value: any): void;
    getSuggestionValue(suggestion: any): any;
    render(): JSX.Element;
}
