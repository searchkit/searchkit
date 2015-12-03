export interface BoundStateMap {
    get(): Array<any> | any;
    getState(val: any): void;
    setState(val: any): void;
    add(val: any): void;
    set(val: any): void;
    toggle(val: any): void;
    contains(val: any): boolean;
    hasKey(): boolean;
    clear(): void;
    clearAll(): void;
    remove(val: any): void;
}
export default class StateMap {
    private state;
    private autoExpiryKeys;
    boundStateMap(key: any): BoundStateMap;
    constructor();
    get(key: any): any[];
    getState(): {
        [key: string]: any[];
    };
    setState(state: any): void;
    addAutoExpiryKey(key: any): void;
    keyChanged(key: any): void;
    add(key: any, val: any): void;
    set(key: any, val: any): void;
    toggle(key: any, val: any): void;
    contains(key: any, val: any): boolean;
    hasKey(key: any): boolean;
    clear(key: any): void;
    clearAll(): void;
    remove(key: any, val: any): void;
    lazyInitKey(key: any): any[];
}
