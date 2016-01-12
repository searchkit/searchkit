import { SearchAccessor, SearchkitComponent, ESTransport } from "../../../../core";
export declare class Autocomplete extends SearchkitComponent<any, any> {
    accessor: SearchAccessor;
    suggestSearcher: ESTransport;
    defineBEMBlocks(): {
        container: any;
    };
    componentWillMount(): void;
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
    render(): JSX.Element;
}
