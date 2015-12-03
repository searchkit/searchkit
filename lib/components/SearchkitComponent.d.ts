import * as React from "react";
import ESClient from "../domain/ESClient.ts";
import Accessor from "../domain/accessors/Accessor.ts";
export default class SearchkitComponent<P, S> extends React.Component<P, S> {
    searcher: ESClient;
    accessor: Accessor;
    static contextTypes: {
        searcher: React.Requireable<any>;
    };
    defineAccessor(): Accessor;
    componentWillMount(): void;
}
