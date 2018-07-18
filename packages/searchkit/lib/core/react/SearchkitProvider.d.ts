import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
export interface SearchkitProps {
    searchkit: SearchkitManager;
    children?: any;
}
export declare class SearchkitProvider extends React.Component<SearchkitProps, any> {
    static childContextTypes: {
        searchkit: any;
    };
    static propTypes: {
        searchkit: any;
        children: any;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    getChildContext(): {
        searchkit: SearchkitManager;
    };
    render(): any;
}
