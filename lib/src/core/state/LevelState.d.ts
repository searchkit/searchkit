import { State } from "./State";
export declare class LevelState extends State<Array<any>> {
    value: Array<any>;
    getValue(): any[];
    add(level: number, val: any): any;
    contains(level: number, val: any): any;
    clear(level?: number): any;
    remove(level: number, val: any): any;
    toggle(level: number, val: any): any;
    getLevel(level: number): Array<string>;
    levelHasFilters(level: number): boolean;
    getLeafLevel(): number;
    isLeafLevel(level: number): boolean;
    toggleLevel(level: any, key: any): LevelState;
}
