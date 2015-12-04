export declare class State<T> {
    value: T;
    constructor(defaultValue?: T);
    setValue(value: T): void;
    getValue(): T;
}
export declare class ArrayState extends State<Array<string>> {
    lazyInit(): string[];
    toggle(val: any): void;
    remove(val: any): void;
    add(val: any): void;
    contains(val: any): boolean;
}
export declare class ObjectState extends State<Object> {
}
export declare class ValueState extends State<string> {
}
