export declare class State<T> {
    value: T;
    constructor(value?: any);
    create(value: any): any;
    setValue(value: T): any;
    clear(): any;
    getValue(): T;
}
export declare class ArrayState extends State<Array<string | number>> {
    lazyInit(): (string | number)[];
    toggle(val: any): any;
    clear(): any;
    remove(val: any): any;
    add(val: any): any;
    contains(val: any): boolean;
}
export declare class ObjectState extends State<Object> {
    lazyInit(): Object;
}
export declare class ValueState extends State<string | number> {
}
