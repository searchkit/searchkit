import * as React from "react";
import Searcher from "./Searcher";
export interface ISearcherProvider {
    searcher: Searcher;
    children?: any;
}
export default class SearcherProvider extends React.Component<ISearcherProvider, any> {
    static childContextTypes: {
        searcher: React.Requireable<any>;
    };
    getChildContext(): {
        searcher: Searcher;
    };
    render(): any;
}
