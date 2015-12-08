import { SearchAccessor, SearchkitComponent, ESRequest } from "../../../../core";
export interface ISearchBox {
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    suggestSearcher: ESRequest;
    showAutoSuggest: boolean;
    constructor(props: ISearchBox);
    createSuggestSearcher(): void;
    defineAccessor(): SearchAccessor;
    onSubmit(event: any): void;
    processSuggestions(results: any): ({
        suggestions: any[];
    } | {
        sectionName: string;
        suggestions: any[];
    })[];
    querySuggestions(query: any, callback: any): void;
    suggestionRenderer(suggestion: any, input: any): JSX.Element;
    getValue(): string;
    onChange(value: any): void;
    render(): JSX.Element;
}
