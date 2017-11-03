/// <reference types="react" />
import { SearchkitComponent } from "searchkit";
import { DatasourceManager } from "./datasources/DatasourceManager";
export declare class SearchkitAutosuggest extends SearchkitComponent<any, any> {
    datasourceManager: DatasourceManager;
    static defaultProps: {
        accessors: any[];
    };
    constructor(props: any);
    componentDidMount(): void;
    onChange: (_event: any, {newValue, method}: {
        newValue: any;
        method: any;
    }) => void;
    renderInputComponent: (inputProps: any) => JSX.Element;
    onSuggestionsFetchRequested: ({value}: {
        value: any;
    }) => Promise<void>;
    onSuggestionSelected: (_e: any, {suggestion}: {
        suggestion: any;
    }) => void;
    onSuggestionsClearRequested: () => void;
    render(): JSX.Element;
}
