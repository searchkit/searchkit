import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
import { Accessor } from "../accessors/Accessor";
import { Searcher } from "../Searcher";
import * as Rx from "rx";
export declare class SearchkitComponent<P, S> extends React.Component<P, S> {
    searchkit: SearchkitManager;
    accessor: Accessor<any>;
    searcher: Searcher;
    stateListenerUnsubscribe: Rx.IDisposable;
    static contextTypes: {
        searchkit: React.Requireable<any>;
        searcher: React.Requireable<any>;
    };
    defineAccessor(): Accessor<any>;
    shouldCreateNewSearcher(): boolean;
    componentWillMount(): void;
    isLoading(): boolean;
    componentWillUnmount(): void;
}
