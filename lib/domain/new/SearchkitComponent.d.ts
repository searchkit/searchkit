import * as React from "react";
import SearchkitManager from "./SearchkitManager";
import Accessor from "./accessors/Accessor";
import Searcher from "./Searcher";
export default class SearchkitComponent<P, S> extends React.Component<P, S> {
    searchkit: SearchkitManager;
    accessor: Accessor<any>;
    searcher: Searcher;
    static contextTypes: {
        searchkit: React.Requireable<any>;
        searcher: React.Requireable<any>;
    };
    defineAccessor(): Accessor<any>;
    shouldCreateNewSearcher(): boolean;
    componentWillMount(): void;
}
