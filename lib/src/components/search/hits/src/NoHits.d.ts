import { SearchkitComponent, SearchkitComponentProps, NoFiltersHitCountAccessor, SuggestionsAccessor } from "../../../../core";
export interface NoHitsProps extends SearchkitComponentProps {
    suggestionsField?: string;
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    noFiltersAccessor: NoFiltersHitCountAccessor;
    suggestionsAccessor: SuggestionsAccessor;
    static translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.NoResultsFoundDidYouMean": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
    };
    translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.NoResultsFoundDidYouMean": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
    };
    static propTypes: {};
    componentWillMount(): void;
    defineBEMBlocks(): {
        container: string;
    };
    getSuggestion(): boolean;
    renderSuggestions(): JSX.Element;
    setQueryString(query: any): void;
    resetFilters(): void;
    renderResetFilters(): JSX.Element;
    render(): JSX.Element;
}
