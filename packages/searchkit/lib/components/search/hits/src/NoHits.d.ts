import { SearchkitComponent, SearchkitComponentProps, NoFiltersHitCountAccessor, SuggestionsAccessor, RenderComponentType } from "../../../../core";
import { NoHitsErrorDisplay, NoHitsErrorDisplayProps } from "./NoHitsErrorDisplay";
import { NoHitsDisplay, NoHitsDisplayProps } from "./NoHitsDisplay";
export interface NoHitsProps extends SearchkitComponentProps {
    suggestionsField?: string;
    errorComponent?: RenderComponentType<NoHitsErrorDisplayProps>;
    component?: RenderComponentType<NoHitsDisplayProps>;
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    noFiltersAccessor: NoFiltersHitCountAccessor;
    suggestionsAccessor: SuggestionsAccessor;
    bemBlocks: {
        container: Function;
    };
    static translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.NoResultsFoundDidYouMean": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
        "NoHits.Error": string;
        "NoHits.ResetSearch": string;
    };
    translations: {
        "NoHits.NoResultsFound": string;
        "NoHits.NoResultsFoundDidYouMean": string;
        "NoHits.DidYouMean": string;
        "NoHits.SearchWithoutFilters": string;
        "NoHits.Error": string;
        "NoHits.ResetSearch": string;
    };
    static propTypes: any;
    static defaultProps: {
        errorComponent: typeof NoHitsErrorDisplay;
        component: typeof NoHitsDisplay;
    };
    componentDidMount(): void;
    defineBEMBlocks(): {
        container: string;
    };
    getSuggestion(): any;
    setQueryString(query: any): void;
    resetFilters(): void;
    resetSearch(): void;
    getFilterCount(): any;
    render(): React.ReactElement<any>;
}
