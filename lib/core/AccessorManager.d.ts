import { Accessor, StatefulAccessor } from "./accessors";
export declare class AccessorManager {
    accessors: Array<Accessor>;
    constructor(accessors?: Array<Accessor>);
    getAccessors(): Accessor[];
    getStatefulAccessors(): Array<StatefulAccessor<any>>;
    add(accessor: any): any;
    getState(): {};
    setState(state: any): void;
    notifyStateChange(oldState: any): void;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
    buildQuery(query: any): any;
    setResults(results: any): void;
    resetState(): void;
}
