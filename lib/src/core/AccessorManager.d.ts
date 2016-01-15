import { Accessor, StatefulAccessor, BaseQueryAccessor } from "./accessors";
export declare class AccessorManager {
    accessors: Array<Accessor>;
    statefulAccessors: {};
    queryAccessor: BaseQueryAccessor;
    constructor();
    getAccessors(): Accessor[];
    getActiveAccessors(): Accessor[];
    getStatefulAccessors(): StatefulAccessor<any>[];
    add(accessor: any): any;
    getState(): {};
    setState(state: any): void;
    notifyStateChange(oldState: any): void;
    getQueryAccessor(): BaseQueryAccessor;
    buildSharedQuery(query: any): any;
    buildOwnQuery(query: any): any;
    buildQuery(query: any): any;
    setResults(results: any): void;
    resetState(): void;
}
