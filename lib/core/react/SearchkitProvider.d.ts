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
    static wrap(app: any, searchkit: any): React.ClassicComponentClass<{}>;
    componentDidMount(): void;
    getChildContext(): {
        searchkit: SearchkitManager;
    };
    render(): any;
}
