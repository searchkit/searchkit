import * as React from "react";
export interface NoHitsErrorDisplayProps {
    errorLabel: string;
    tryAgainLabel: string;
    resetSearchFn: Function;
    translate: Function;
    bemBlocks: {
        container: Function;
    };
    error: any;
}
export declare class NoHitsErrorDisplay extends React.Component<NoHitsErrorDisplayProps, any> {
    render(): JSX.Element;
}
