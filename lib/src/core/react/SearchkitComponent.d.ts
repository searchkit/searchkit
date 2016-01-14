import * as React from "react";
import { SearchkitManager } from "../SearchkitManager";
import { ImmutableQuery } from "../query";
import { Accessor } from "../accessors/Accessor";
export interface SearchkitComponentProps {
    mod?: string;
    translations?: Object;
    searchkit?: SearchkitManager;
}
export declare class SearchkitComponent<P extends SearchkitComponentProps, S> extends React.Component<P, S> {
    searchkit: SearchkitManager;
    accessor: Accessor;
    stateListenerUnsubscribe: Function;
    bemBlocks: any;
    blockClass: string;
    translations: Object;
    static contextTypes: {
        searchkit: React.Requireable<any>;
    };
    defineBEMBlocks(): any;
    defineAccessor(): Accessor;
    translate(key: any): any;
    componentWillMount(): void;
    getResults(): any;
    getHits(): any[];
    getHitsCount(): number;
    hasHits(): boolean;
    getQuery(): ImmutableQuery;
    isInitialLoading(): boolean;
    isLoading(): boolean;
    getError(): any;
    componentWillUnmount(): void;
}
