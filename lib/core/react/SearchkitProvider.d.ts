import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
export interface ISearcherProvider {
    searchkit: SearchkitManager;
    children?: any;
}
export declare class SearchkitProvider extends React.Component<ISearcherProvider, any> {
    static childContextTypes: {
        searchkit: React.Requireable<any>;
    };
    results: any;
    componentDidMount(): void;
    getChildContext(): {
        searchkit: SearchkitManager;
    };
    render(): any;
}
