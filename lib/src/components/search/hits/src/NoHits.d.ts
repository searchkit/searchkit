import { SearchkitComponent, SearchkitComponentProps } from "../../../../core";
export interface NoHitsProps extends SearchkitComponentProps {
}
export declare class NoHits extends SearchkitComponent<NoHitsProps, any> {
    static translations: {
        "NoHits.NoResultsFound": string;
    };
    defineBEMBlocks(): {
        container: string;
    };
    renderSuggestions(): void;
    render(): JSX.Element;
}
