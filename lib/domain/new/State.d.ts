export declare class State<T> {
    value: T;
    constructor(defaultValue: T);
    setValue(value: T): void;
    getValue(): T;
}
export declare class ArrayState extends State<Array<string>> {
}
export declare class ObjectState extends State<Object> {
}
export declare class ValueState extends State<string> {
}
