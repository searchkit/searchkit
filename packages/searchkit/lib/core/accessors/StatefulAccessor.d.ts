import { State } from "../state";
import { Accessor } from "./Accessor";
export declare class StatefulAccessor<T extends State<any>> extends Accessor {
    key: string;
    urlKey: string;
    state: T;
    resultsState: T;
    constructor(key: any, urlString?: any);
    onStateChange(_oldState: any): void;
    fromQueryObject(ob: any): void;
    getQueryObject(): {
        [x: string]: any;
    };
    setSearchkitManager(searchkit: any): void;
    setResults(results: any): void;
    setResultsState(): void;
    resetState(): void;
    urlWithState(state: T): string;
}
