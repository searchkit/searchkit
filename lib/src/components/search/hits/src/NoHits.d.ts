import { SearchkitComponent, SearchkitComponentProps, NoFiltersHitCountAccessor } from "../../../../core";
export interface NoHitsProps extends SearchkitComponentProps {
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    accessor: NoFiltersHitCountAccessor;
    static translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
    };
    translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
    };
    static propTypes: {};
    defineAccessor(): NoFiltersHitCountAccessor;
    defineBEMBlocks(): {
        container: string;
    };
    renderSuggestions(): JSX.Element;
    resetFilters(): void;
    renderResetFilters(): JSX.Element;
    setQueryString(query: any): void;
    render(): JSX.Element;
}
