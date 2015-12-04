export declare class State<T> {
    value: T;
    defaultValue: T;
    constructor(defaultValue?: T);
    setValue(value: T): State<T>;
    clear(): void;
    getValue(): T;
}
export declare class ArrayState extends State<Array<string | number>> {
    lazyInit(): (string | number)[];
    toggle(val: any): void;
    clear(): void;
    remove(val: any): void;
    add(val: any): void;
    contains(val: any): boolean;
}
export declare class ObjectState extends State<Object> {
}
export declare class ValueState extends State<string | number> {
}
