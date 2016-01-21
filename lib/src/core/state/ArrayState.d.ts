import { State } from "./State";
export declare class ArrayState extends State<Array<string | number>> {
    getValue(): (string | number)[];
    toggle(val: any): any;
    clear(): any;
    remove(val: any): any;
    add(val: any): any;
    contains(val: any): any;
}
