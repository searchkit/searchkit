export declare class State<T> {
    value: T;
    constructor(value?: any);
    create(value: any): any;
    setValue(value: T): any;
    clear(): any;
    getValue(): T;
    hasValue(): boolean;
}
