import { SearchAccessor, SearchkitComponent, ESRequest } from "../../../../core";
export interface ISearchBox {
}
export declare class SearchBox extends SearchkitComponent<ISearchBox, any> {
    accessor: SearchAccessor;
    suggestSearcher: ESRequest;
    constructor(props: ISearchBox);
    componentWillMount(): void;
    defineAccessor(): SearchAccessor;
    onSubmit(event: any): void;
    processSuggestions(results: any): {
        sectionName: string;
        suggestions: any[];
    }[];
    getSuggestionQueryObject(query: any): {
        size: number;
        suggest: {
            text: any;
            "suggestions": {
                "phrase": {
                    field: string;
                    "real_word_error_likelihood": number;
                    "max_errors": number;
                    "gram_size": number;
                    "direct_generator": {
                        "field": string;
                        "suggest_mode": string;
                        "min_word_length": number;
                    }[];
                    "highlight": {
                        "pre_tag": string;
                        "post_tag": string;
                    };
                };
            };
            "completion": {
                completion: {
                    field: string;
                };
            };
        };
    };
    querySuggestions(query: any, callback: any): void;
    suggestionRenderer(suggestion: any, input: any): JSX.Element;
    getValue(): string;
    onChange(value: any): void;
    suggestionValue(suggestion: any): any;
    onSuggestionSelected(value: any): void;
    render(): JSX.Element;
}
