import * as rx from "rx";
import StateManager from "./state/StateManager";
export default class ESClient {
    host: string;
    index: string;
    query: any;
    results: any;
    resultsListener: rx.ReplaySubject<any>;
    stateManager: StateManager;
    private registrationCompleted;
    completeRegistration: Function;
    constructor(host: string, index: string);
    setStateQuery(stateQuery: any): void;
    searchUrl(): string;
    getQuery(): any;
    listenToHistory(history: any): void;
    search(): void;
}
