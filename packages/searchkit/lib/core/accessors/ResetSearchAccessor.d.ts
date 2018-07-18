import { Accessor } from "./";
export interface ResetSearchOptions {
    query?: boolean;
    filter?: boolean;
    pagination?: boolean;
}
export declare class ResetSearchAccessor extends Accessor {
    options: ResetSearchOptions;
    constructor(options?: ResetSearchOptions);
    canReset(): boolean;
    performReset(): void;
}
