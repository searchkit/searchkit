import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
import { Accessor } from "../accessors/Accessor";
import { Searcher } from "../Searcher";
export declare class SearchkitComponent<P, S> extends React.Component<P, S> {
    searchkit: SearchkitManager;
    accessor: Accessor<any>;
    searcher: Searcher;
    stateListenerUnsubscribe: Function;
    bemBlocks: any;
    blockClass: string;
    static contextTypes: {
        searchkit: React.Requireable<any>;
        searcher: React.Requireable<any>;
    };
    constructor(props: any);
    getBlockCSSClass(): any;
    defineAccessor(): Accessor<any>;
    shouldCreateNewSearcher(): boolean;
    translate(key: any): any;
    componentWillMount(): void;
    isLoading(): boolean;
    getError(): any;
    componentWillUnmount(): void;
}
