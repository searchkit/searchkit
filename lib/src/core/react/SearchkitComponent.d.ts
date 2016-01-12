import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
import { ImmutableQuery } from "../query";
import { Accessor } from "../accessors/Accessor";
export declare class SearchkitComponent<P, S> extends React.Component<P, S> {
    searchkit: SearchkitManager;
    accessor: Accessor;
    stateListenerUnsubscribe: Function;
    bemBlocks: any;
    blockClass: string;
    static contextTypes: {
        searchkit: React.Requireable<any>;
    };
    defineBEMBlocks(): any;
    defineAccessor(): Accessor;
    translate(key: any): any;
    componentWillMount(): void;
    getResults(): any;
    getQuery(): ImmutableQuery;
    isInitialLoading(): boolean;
    isLoading(): boolean;
    getError(): any;
    componentWillUnmount(): void;
}
