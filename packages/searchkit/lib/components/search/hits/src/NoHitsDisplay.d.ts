import * as React from "react";
export interface NoHitsDisplayProps {
    noResultsLabel: string;
    resetFiltersFn: Function;
    setSuggestionFn: Function;
    translate: Function;
    bemBlocks: {
        container: Function;
    };
    suggestion: string;
    query: string;
    filtersCount: number;
}
export declare class NoHitsDisplay extends React.Component<NoHitsDisplayProps, any> {
    getSuggestionAction(): JSX.Element;
    getResetFilterAction(): JSX.Element;
    render(): JSX.Element;
}
