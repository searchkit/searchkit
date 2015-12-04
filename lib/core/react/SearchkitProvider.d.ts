import * as React from "react";
import * as Rx from "rx";
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
    searcherUnsubscribe: Rx.IDisposable;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getChildContext(): {
        searchkit: SearchkitManager;
    };
    render(): any;
}
